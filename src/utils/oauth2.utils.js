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
 * @param res
 * @param next
 */
export function addClientToListOfClients(req, res, next) {
  try {
    const {clients = [], client = {}, query} = req.session;
    if (client.proxy) {
      // A client setup as a proxy should not be registered as a client the user is logged in through
      return;
    }
    clients.push({
      singleLogoutUrl: createSingleLogoutUrl(
        query.redirect_uri,
        client.singleLogoutPath
      ),
      clientId: client.clientId,
      name: client.name,
      redirectUris: client.redirectUris,
      urls: client.urls
    });

    // Add the users login to the log (for debug use)
    log.debug(
      'UserLogin: A user logged in to a client',
      {
        userId: req.getUser().userId,
        clientId: req.getState().serviceClient.clientId
      },
      false
    );

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
 * Convert a singlelogout path to a full url dependant on the redirect url used for login.
 *
 * @param {String} originUrl
 * @param {String} singleLogoutPath
 * @returns {String}
 */
export function createSingleLogoutUrl(originUrl, singleLogoutPath) {
  try {
    const redirectUrl = new URL(originUrl);
    const singleLogoutUrl = singleLogoutPath
      ? `${redirectUrl.origin}${singleLogoutPath}`
      : '';
    return singleLogoutUrl.includes('localhost') ||
      singleLogoutUrl.includes('web')
      ? singleLogoutUrl
      : singleLogoutUrl.replace('http://', 'https://');
  } catch (e) {
    log.warn('Singlelogout url could not be generated', {
      error: e.message,
      stack: e.stack
    });
    return '';
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
        `^${uri.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`, 'g'
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
  if (shouldUserLogIn(req.session)) {
    req.session.save(() => {
      return res.redirect('/login');
    });
  } else {
    next();
  }
}

/**
 * Utility function that determines if the session meets the conditions for skipping log in.
 *
 * @param {Object} session
 */
function shouldUserLogIn(session) {
  // If client is not set we continue the flow and fail later in the process.
  if (!session.client) {
    return false;
  }

  // If user is not set, they should log in.
  if (!session.user || !session.user.userId) {
    return true;
  }

  // if idp is set and user have not used that idp, the user should log in
  if (
    session.query.idp &&
    !session.user.identityProviders.includes(session.query.idp)
  ) {
    return true;
  }

  // Test if user has logged in with idp that matches client.
  const matchingIdp = session.client.identityProviders.filter(idp =>
    session.user.identityProviders.includes(idp)
  );

  // If it matches, login is not needed
  if (matchingIdp.length > 0) {
    return false;
  }

  // In all remaining conditions login is needed.
  return true;
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
