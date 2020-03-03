import {getClientInfoByClientId} from '../components/Smaug/smaug.component';
import {uniqBy} from 'lodash';

import {
  getClientByToken,
  getTokenByAuth
} from '../components/Smaug/smaug.client';
import {log} from './logging.util';

/**
 * Extracts ClientId from auth
 *
 * @export
 * @param {*} auth String
 * @returns {String} ClientId
 */

export function getClientByAuth(auth) {
  if (!auth) {
    log.error('Missing required param `auth`');
    return false;
  }

  // Removes the "Basic " sub-string from auth and decodes the base64 to string.
  const base = Buffer.from(auth.replace('Basic ', ''), 'base64');
  const str = base.toString();

  // Returns ClientId from string ("CLIENT_ID:CLIENT_SECRET")
  return str.split(':')[0];
}

/**
 * Retrieves Smaug client data from token, and checks if
 * client is allowed to access the introspection endpoint.
 *
 * @export
 * @param {*} token string
 * @returns Boolean
 */

export async function validateIntrospectionAccess(token) {
  if (!token) {
    log.error('Missing required param `token`');
    return false;
  }

  try {
    const response = await getClientByToken(token);
    return response.introspection;
  } catch (error) {
    log.error('Error validating client introspection access', {
      stack: error.stack,
      message: error.message
    });
  }
}

/**
 * Clear session when login is initiated
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */
export function clearClientOnSession(req, res, next) {
  req.session.client = null;
  req.session.save(() => next());
}

/**
 * Add current client to the list of clients a user is logged in to.
 *
 * @export
 * @param {object} req
 */
export function addClientToListOfClients(req, res, next) {
  try {
    const {clients = [], client = {}, query} = req.session;
    if (client.proxy) {
      // A client setup as a proxy should not be registered as a client the user is logged in through
      return;
    }
    const redirectUrl = new URL(query.redirect_uri);
    const singleLogoutUrl = client.singleLogoutPath
      ? `${redirectUrl.origin}${client.singleLogoutPath}`
      : null;
    clients.push({
      singleLogoutUrl,
      clientId: client.clientId,
      name: client.name,
      redirectUris: client.redirectUris,
      urls: client.urls
    });
    req.session.clients = uniqBy(clients, 'clientId');
    req.session.save(() => next());
  } catch (error) {
    log.error('Error when adding login client', {
      stack: error.stack,
      message: error.message
    });
    next();
  }
}

/**
 * Helper function to validate redirectUris with wildcards.
 *
 * @export
 * @param {String} redirect_uri
 * @param {Array} client
 * @returns Boolean
 */
export function validateRedirectUri(redirect_uri, client) {
  const res =
    client.redirectUris.filter(uri => {
      const req = new RegExp(
        `^${uri.replace('.', '\\.').replace(['*'], '.*')}$`
      );
      return redirect_uri.match(req);
    }).length > 0;

  return res;
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
  if (
    !req.session.client ||
    !validateRedirectUri(req.query.redirect_uri, req.session.client)
  ) {
    return authorizationMiddleware(req, res, next);
  }

  req.session.save(() => next());
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
