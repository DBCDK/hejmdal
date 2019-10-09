import {mockData} from '../components/Smaug/mock/smaug.client.mock';
import {
  getClientInfoByClientId,
  extractClientInfo
} from '../components/Smaug/smaug.component';
import {log} from './logging.util';

export function disableRedirectUrlCheck(req, res, next) {
  // This is a hack to allow all redirect_uris. This should only be included in the mock implementation.
  if (req.query.client_id === 'hejmdal') {
    mockData.redirectUris = [
      ...new Set([...mockData.redirectUris, req.query.redirect_uri])
    ]; // Make shure list is unique
    req.session.client = extractClientInfo(mockData);
  } else {
    req.session.client = null;
  }
  next();
}

/**
 * Add current client to the list of clients a user is logged in to.
 *
 * @export
 * @param {object} req
 */
export function addClientToListOfClients(req) {
  try {
    const {clients = [], client = {}, query} = req.session;
    const redirectUrl = new URL(query.redirect_uri);
    const singleLogoutUrl = client.singleLogoutPath
      ? `${redirectUrl.origin}${client.singleLogoutPath}`
      : null;
    clients.push({
      singleLogoutUrl,
      clientId: client.clientId,
      redirectUris: client.redirectUris
    });
    req.session.clients = clients;
    req.session.save();
  } catch (error) {
    log.error('Error when adding login client', {
      stack: error.stack,
      message: error.message
    });
  }
}

/**
 * Middleware for validating request.
 *
 * Checks if a valid oauth request is made.
 * For now we only tests if clientId is valid and saves client on session.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function validateAuthRequest(req, res, next) {
  if (req.query.client_id && !req.session.client) {
    req.session.client = await getClientInfoByClientId(req.query.client_id);
  }

  if (!req.session.client) {
    authorizationMiddleware(req, res, next);
  } else {
    next();
  }
}

/**
 * Middleware that checks if a user is logged in.
 *
 * If the user is not logged in, the user is redirected to the login flow.
 * Query params are saved on the session for later use.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function isUserLoggedIn(req, res, next) {
  req.session.query = {
    state: req.query.state,
    scope: req.query.scope,
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri,
    response_type: req.query.response_type,
    agency: req.query.agency,
    presel: req.query.presel,
    agencytype: req.query.agencytype,
    idp: req.query.idp
  };
  if ((!req.session.user || !req.session.user.userId) && req.session.client) {
    req.session.save(() => {
      return res.redirect('/login');
    });
  } else {
    next();
  }
}

/**
 * Middleware for initializing oauth authorization.
 */
export function authorizationMiddleware(req, res, next) {
  const options = {
    authenticateHandler: {
      handle: getUserFromState,
      continueMiddleware: false
    }
  };
  return req.app.oauth.authorize(options)(req, res, next);
}

/**
 * Helper function used in the authenticateHander to return a user.
 *
 * @param {Object} req
 */
function getUserFromState(req) {
  return req.getUser();
}
