import {createHash} from '../utils/hash.utils';
/**
 * @file
 * Add methods for handling the state object
 */

/**
 * Adds the get- and setState methods to the context object
 *
 * @param {object} ctx
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
 * @param ctx
 * @param next
 */
export async function setDefaultState(req, res, next) {
  req.session.state = {
    stateHash: req.session.query ? generateStateHash(req.session.query) : '',
    consents: {}, // contains consent attributes for services [serviceName] = Array(attributes)
    returnUrl: handleNullFromUrl(req.query.return_url),
    serviceAgency: handleNullFromUrl(req.query.agency),
    serviceClient: req.session.client,
    ticket: req.ticket || {} // ticketId (id) and ticketToken (token) and/or attributes object,
  };
  req.session.loginToProfile = !!req.query.loginToProfile;
  req.session.user = req.session.user || {};
  return next();
}

/**
 * Check that endpoint is not called directly, but only through oauth endpoints
 *
 * @param {Express request} req
 * @param {Express response} res
 * @param {Express middleware callback} next
 */
export function validateClientIsSet(req, res, next) {
  if (!req.session.client || !req.session.query) {
    res.status(403);
    res.send('Login cannot called directly. Please authorize through /oauth/authorize. '
    + 'For more information on how to implement login through login.bib.dk goto login.bib.dk/example');
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
  return query.state || createHash(`${query.clientId}:${Date.now()}`);
}

/**
 * return null if value is the string 'null'
 *
 * @param urlValue
 * @returns {*}
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
  const existingIps =
    (this.session.user && this.session.user.identityProviders) || [];
  const identityProviders =
    (!existingIps.includes(newValues.userType) &&
      existingIps.concat([newValues.userType])) ||
    existingIps;
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
  return this.session.user;
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
    identityProvider => identityProvider !== idp
  );
  this.session.user = {identityProviders: identityProviders};
}
