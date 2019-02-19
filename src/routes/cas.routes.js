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
const router = Router();

const casStorage = CONFIG.mock_storage
  ? new KeyValueStorage(new MemoryStorage())
  : new KeyValueStorage(new PersistentCasStorage());

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
  } catch (e) {
    return next(e);
  }

  // Validate if client is CAS enabled
  if (!client.grants || !client.grants.includes('cas')) {
    return next(new Error('This client cannot use CAS authorization'));
  }

  // Validate service url
  if (!client.redirectUris.includes(service)) {
    return next(new Error('Invalid service url'));
  }
  // Redirect to authenticate endpoint
  res.redirect(
    `/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${
      CONFIG.app.host
    }/cas/callback&agency=${agencyId}`
  );
});

/**
 * Callback route for oAuth.
 */
router.get('/callback', (req, res, next) => {
  const {code} = req.query;
  const {casOptions} = req.session;
  if (!code) {
    return next(
      new Error('code is required. This url cannot be called directly')
    );
  }
  if (!casOptions && !casOptions.service) {
    return next(
      new Error(
        'No service url have been registered. this url cannot be called directly'
      )
    );
  }
  casStorage.insert(code, casOptions);
  res.redirect(`${casOptions.service}?ticket=${code}`);
});

router.get(
  '/:clientId/:agencyId/serviceValidate',
  validateServiceUrl,
  convertTicketToUser
);

async function validateServiceUrl(req, res, next) {
  const {ticket, service} = req.query;
  const casOptions = await casStorage.read(ticket);
  if (!casOptions) {
    return res.send(invalidResponseXml(ticket, 'INVALID_TICKET'));
  }
  if (casOptions.service !== service) {
    res.set('Content-Type', 'text/xml');
    return res.send(invalidResponseXml(ticket, 'INVALID_SERVICE_URL'));
  }
  next();
  // service url matches original service url.
}

function validResponseXml(user) {
  return `
  <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
    <cas:authenticationSuccess>
      <cas:user>${user}</cas:user>
    </cas:authenticationSuccess>
  </cas:serviceResponse>`;
}

function invalidResponseXml(ticket, errorCode) {
  return `
  <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
    <cas:authenticationFailure code="${errorCode}">
      Ticket ${ticket} not recognized
    </cas:authenticationFailure>
  </cas:serviceResponse>`;
}

async function convertTicketToUser(req, res, next) {
  const {ticket} = req.query;
  const {clientId} = req.params;
  const authCodeResponse = await getAuthorizationCode(ticket);
  if (!authCodeResponse) {
    return res.send(invalidResponseXml(ticket, 'INVALID_TICKET'));
  }
  const {uniqueId} = await getUserAttributesForClient(
    authCodeResponse.user,
    clientId
  );
  if (!uniqueId) {
    return res.send(invalidResponseXml(ticket, 'INVALID_USER'));
  }

  return res.send(validResponseXml(uniqueId));
}

router.use((err, req, res, next) => {
  res.status(400);
  res.send(err.message);
});

export default router;
