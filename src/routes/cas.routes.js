/**
 * @file
 * Contains routes for making authentication using the CAS prototol.
 * Theese routes functions as a gateway towards the oAuth implementation.
 */
import {Router} from 'express';
import {CONFIG} from '../utils/config.util';
import KeyValueStorage from '../models/keyvalue.storage.model';
import MemoryStorage from '../models/memory.storage.model';
import PersistentCasStorage from '../models/CasStorage/cas.persistent.storage.model';
import {getAuthorizationCode} from '../oAuth2/oAuth2.model';
import {getUserAttributesForClient} from '../components/User/user.component';
import {getClientById} from '../components/Smaug/smaug.client';
import {log} from '../utils/logging.util';
import {getHost} from '../utils/url.util';
const router = Router();

const casStorage = CONFIG.mock_storage
  ? new KeyValueStorage(new MemoryStorage())
  : new KeyValueStorage(new PersistentCasStorage());

/**
 * Login endpoint for CAS authorization
 *
 */
router.get('/:clientId/:agencyId/login', async (req, res, next) => {
  const {clientId, agencyId} = req.params;
  const {service} = req.query;
  let client;
  req.session.casOptions = {
    service,
    clientId,
    agencyId
  };
  try {
    client = await getClientById(clientId);
    if (!client) {
      throw new Error('Invalid client');
    }
    req.session.casOptions.client = client;
  } catch (e) {
    return next(new Error('Invalid client'));
  }

  // Validate if client is CAS enabled
  if (!client.grants || !client.grants.includes('cas')) {
    return next(new Error('This client cannot use CAS authorization'));
  }

  // Validate service url
  if (!client.redirectUris.includes(getHost(service))) {
    return next(new Error('Invalid service url'));
  }
  req.session.save(() => {
    // Redirect to authenticate endpoint
    res.redirect(
      `/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${CONFIG.app.host}/cas/callback&agency=${agencyId}`
    );
  });
});

/**
 * Callback route for oAuth.
 *
 * This is the callback url for then when user has been authenticated through oauth.
 * This endpoint cannot be called directly. It requires that casOptions have been set with
 * a valid service url. This is set through the endpoint /:clientId/:agencyId/login.
 */
router.get('/callback', async (req, res, next) => {
  const {code} = req.query;
  const {casOptions} = req.session;
  if (!code) {
    return next(
      new Error('code is required. This url cannot be called directly')
    );
  }
  if (!casOptions || !casOptions.service) {
    return next(
      new Error(
        'No service url have been registered. this url cannot be called directly'
      )
    );
  }

  // Save service url with oauth code
  await casStorage.insert(code, casOptions);
  await addClientToSingleLogout(req, casOptions.service, casOptions.client);
  await req.session.save(() => {
    // Redirect back to service with a oauth code as ticket
    const redirectUrl = new URL(casOptions.service);
    redirectUrl.searchParams.append('ticket', code);
    res.redirect(redirectUrl);
  });
});

router.get(
  '/:clientId/:agencyId/serviceValidate',
  validateServiceUrl,
  convertTicketToUser
);

/**
 * Create a logout url from the CAS service return url.
 *
 * @param {String} service
 * @returns {String}
 */
export function createSingleLogoutUrl(service) {
  if (CONFIG.app.env === 'test') {
    const {origin, pathname} = new URL(service);
    return `${origin}${pathname}/logout`;
  }
  const {href} = new URL('/logout', service);
  return href.replace('http://', 'https://');
}

/**
 * Add Singlelogout endpoint to List of clients user is logged into.
 *
 * @param {Request} req
 * @param {String} service
 * @returns {Promise}
 */
async function addClientToSingleLogout(req, service) {
  const {clients = []} = req.session;
  clients.push({
    singleLogoutUrl: createSingleLogoutUrl(service)
  });
  req.session.clients = clients;
  return new Promise(res => req.session.save(res));
}

/**
 * Validate request to serviceValidate endpoint.
 *
 * Check if ticket and service parameters are valid.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */
async function validateServiceUrl(req, res, next) {
  const {ticket, service} = req.query;
  const casOptions = await casStorage.read(ticket);
  if (!casOptions) {
    return res.send(invalidResponseXml(ticket, 'INVALID_TICKET'));
  }
  // remove ticket from db.
  await casStorage.delete(ticket);

  if (casOptions.service !== service) {
    res.set('Content-Type', 'text/xml');
    return res.send(invalidResponseXml(ticket, 'INVALID_SERVICE_URL'));
  }

  next();
}

/**
 * Exchange a valid oauth code for a user ID.
 *
 * Response is formatted as a valid CAS XML response.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */
async function convertTicketToUser(req, res, next) {
  const {ticket} = req.query;
  const {clientId} = req.params;
  const authCodeResponse = await getAuthorizationCode(ticket);
  if (!authCodeResponse) {
    return res.send(invalidResponseXml(ticket, 'INVALID_TICKET'));
  }
  const {uniqueId, municipality} = await getUserAttributesForClient(
    authCodeResponse.user,
    clientId
  );
  if (!uniqueId) {
    return res.send(invalidResponseXml(ticket, 'INVALID_USER'));
  }

  return res.send(validResponseXml(uniqueId, municipality));
}

/**
 * Valid reponse XML.
 *
 * @param {String} user
 * @returns {String}
 */
function validResponseXml(user, municipality = '') {
  return `
  <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
    <cas:authenticationSuccess>
      <cas:user>${user}</cas:user>
      <cas:municipality>${municipality}</cas:municipality>
    </cas:authenticationSuccess>
  </cas:serviceResponse>`;
}

/**
 * Invalid response XML.
 *
 * @param {String} ticket
 * @param {String} errorCode
 * @returns {String}
 */
function invalidResponseXml(ticket, errorCode) {
  return `
  <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
    <cas:authenticationFailure code="${errorCode}">
      Ticket ${ticket} not recognized
    </cas:authenticationFailure>
  </cas:serviceResponse>`;
}

/**
 * Handle errors on CAS routes.
 */
router.use((err, req, res, next) => {
  res.status(400);
  log.error('CAS authentication error', {
    error: err.message,
    stack: err.stack
  });
  res.send(err.message);
});

export default router;
