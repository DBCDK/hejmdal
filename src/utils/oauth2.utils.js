import {mockData} from '../components/Smaug/mock/smaug.client.mock';

export function disableRedirectUrlCheck(req, res, next) {
  // This is a hack to allow all redirect_uris. This should only be included in the mock implementation.
  mockData.redirectUris.push(req.query.redirect_uri);
  next();
}

/**
 * Middleware for validating request.
 *
 * Checks if a valid oauth request is made.
 * For now we only tests if clientId is valid and saves client on session.
 *
 * TODO: Check
 *  - return_uri
 *  - response_type
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function validateAuthRequest(req, res, next) {
  if (req.query.client_id) {
    req.session.client = await req.app.model.getClient(req.query.client_id);
  }
  next();
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
    response_type: req.query.response_type
  };
  if (!req.session.user && req.session.client) {
    return res.redirect('/login');
  }
  // TODO should we load the user from db here?
  next();
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
