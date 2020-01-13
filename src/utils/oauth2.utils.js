import {getClientInfoByClientId} from '../components/Smaug/smaug.component';
import {promiseRequest} from './request.util';
import {
  getClientById,
  getClientByToken
} from '../components/Smaug/smaug.client';
import {log} from './logging.util';

/**
 * ...
 *
 * @export
 * @param {*} autorization string
 * @returns token string
 */

export async function validateClient(auth) {
  console.log('validateClient() .........');

  const response = await promiseRequest('post', {
    url: 'https://auth.dbc.dk/oauth/token',
    method: 'POST',
    body: 'grant_type=password&username=@&password=@',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: auth
    }
  });

  const parsed = JSON.parse(response.body);
  return parsed.access_token;
}

/**
 * ...
 *
 * @export
 * @param {*} token
 * @returns Boolean
 */

export async function validateIntrospectionAccess(token) {
  console.log('validateClientIntrospectionAccess() .........');
  try {
    if (token) {
      const response = await getClientByToken(token);
      return response.introspection;
    }

    log.error('validateIntrospectionAccess() - Missing client or token');
    return false;
  } catch (error) {
    log.error('Error validating client introspection access');
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
export function addClientToListOfClients(req) {
  try {
    const {clients = [], client = {}, query} = req.session;
    const redirectUrl = new URL(query.redirect_uri);
    const singleLogoutUrl = client.singleLogoutPath
      ? `${redirectUrl.origin}${client.singleLogoutPath}`
      : null;
    clients.push({
      singleLogoutUrl,
      ...client
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
