import {createHash} from '../utils/hash.utils';
import {get} from 'lodash';
/**
 * @file
 * Add methods for handling the state object
 */

/**
 * Adds the get- and setState methods to the context object
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
export async function stateMiddleware(req, res, next) {
  Object.assign(req, {
    getState,
    setState,
    getUser,
    setUser,
    hasUser,
    resetUser
  });

  next();
}

/**
 * Sets the default values on the context
 *
 * @param req
 * @param res
 * @param next
 */
export async function setDefaultState(req, res, next) {
  req.session.state = {
    stateHash: setStateHash(req),
    consents: {}, // contains consent attributes for services [serviceName] = Array(attributes)
    returnUrl: handleNullFromUrl(req.query.return_url),
    serviceAgency:
      req.session.query && handleNullFromUrl(req.session.query.agency),
    serviceClient: req.session.client,
    ticket: req.ticket || {} // ticketId (id) and ticketToken (token) and/or attributes object,
  };
  req.session.loginToProfile = !!req.query.loginToProfile;
  req.session.user = req.session.user || {};
  req.session.save(() => {
    return next();
  });
}

/**
 * Adds a state hash value to session.
 *
 * The state hash is used to validate that responses from identity providers are
 * initiated in the current session. If not the user must af initiated login from an
 * invalid flow.
 *
 * @param {Request} req
 * @returns {Array} A list of valid hash values.
 */
function setStateHash(req) {
  let currentHash = get(req, 'session.state.stateHash');
  const {query = {}} = req.session;
  // Statehash used to be an array, so this is needed for legacy reasons.
  if (Array.isArray(currentHash) && currentHash[0]) {
    currentHash = currentHash[0];
  }
  return currentHash || generateStateHash(query);
}

/**
 * Check that endpoint is not called directly, but only through oauth endpoints
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
export function validateClientIsSet(req, res, next) {
  if (!req.session.client || !req.session.query) {
    res.status(403);
    res.send(
      'Login cannot called directly. Please authorize through /oauth/authorize. ' +
        'For more information on how to implement login through login.bib.dk goto login.bib.dk/example'
    );
  } else {
    next();
  }
}

/**
 * Generate hash values for validating redirects.
 *
 * @param {Object} query
 */
function generateStateHash(query) {
  return createHash(`${query.clientId}:${Date.now()}`);
}

/**
 * return null if value is the string 'null'
 *
 * @param urlValue
 * @returns {string|null}
 */
function handleNullFromUrl(urlValue) {
  return urlValue === 'null' ? null : urlValue || null;
}

/**
 * Set new values on State object
 *
 * @param newValues
 * @returns {Object}
 */
function setState(newValues) {
  this.session.state = Object.assign({}, this.session.state || {}, newValues);
  return this.session.state;
}

/**
 * Get the State object
 *
 * @returns {Object}
 */
function getState() {
  return (this.session && this.session.state) || null;
}

/**
 * Set new values on User object
 *
 * @param newValues
 * @returns {Object}
 */
function setUser(newValues) {
  const identityProviders = [newValues.userType];
  this.session.user = Object.assign({}, this.session.user || {}, newValues, {
    identityProviders
  });
  return this.session.user;
}

/**
 * Get the User object
 *
 * @returns {Object}
 */
function getUser() {
  return this.session.user || {};
}

/**
 * Check if user is set on session
 *
 * @returns {boolean}
 */
function hasUser() {
  return (
    (this.session && this.session.user && this.session.user.userId && true) ||
    false
  );
}

/**
 * Clear user info and remove idp from list of identityProviders
 * @param idp
 */
function resetUser(idp) {
  const identityProviders = this.getUser().identityProviders.filter(
    (identityProvider) => identityProvider !== idp
  );
  this.session.user = {identityProviders: identityProviders};
}
