/**
 * @file
 * Consent component handling the nessecary consent
 */

import {form} from 'co-body';
import {VERSION_PREFIX} from '../../utils/version.util';
import {CONFIG} from '../../utils/config.util';
import KeyValueStorage from '../../models/keyvalue.storage.model';
import MemoryStorage from '../../models/memory.storage.model';
import PersistentConsentStorage from '../../models/Consent/consent.persistent.storage.model';
import {log} from '../../utils/logging.util';
import {getHelpText} from '../../utils/help.text.util';

const consentStore = CONFIG.mock_storage.consent ?
  new KeyValueStorage(new MemoryStorage()) :
  new KeyValueStorage(new PersistentConsentStorage());

/**
 * Renders the consent UI
 *
 * @param {object} ctx
 * @param {function} next
 */
export async function giveConsentUI(ctx, next) {
  const state = ctx.getState();
  if (!state || !state.serviceClient || !state.serviceClient.id) {
    ctx.redirect(`${VERSION_PREFIX}/fejl`);
  }
  else {
    const returnUrl = state.returnUrl ? state.serviceClient.urls.host + state.returnUrl : '';
    const helpText = getHelpText(['consent'], {__SERVICE_CLIENT_NAME__: state.serviceClient.name});
    ctx.render('Consent', {
      attributes: setConsentAttributes(state.serviceClient.attributes, state.ticket.attributes),
      consentAction: VERSION_PREFIX + '/login/consentsubmit/' + state.smaugToken,
      consentFailed: false,
      returnUrl: returnUrl,
      serviceName: state.serviceClient.name,
      help: helpText
    });
    await next();
  }
}

/**
 * Submit handler for consent submission. If consent is rejected consentRejected is invoked. It it's accepted the
 * consent is requested to be saved and the flow is continued.
 *
 * @param {object} ctx
 * @param {function} next
 */
export async function consentSubmit(ctx, next) {
  const response = await getConsentResponse(ctx);

  if (!response || !response.userconsent || (response.userconsent && response.userconsent === '0')) {
    const serviceClient = ctx.getState().serviceClient;
    const returnUrl = serviceClient.urls.host + serviceClient.urls.error + '?message=consent%20was%20rejected`';
    const helpText = getHelpText(['consentReject'], {__SERVICE_CLIENT_NAME__: serviceClient.name});
    ctx.setState({ticket: {}});
    ctx.render('Consent', {
      consentFailed: true,
      returnUrl: returnUrl,
      serviceName: serviceClient.name,
      help: helpText
    });
  }
  else {
    await storeUserConsent(ctx);
  }
  await next();
}

/**
 * Retrieving consent response through co-body module
 *
 * @param ctx
 * @return {{}}
 */
async function getConsentResponse(ctx) {
  let response = null;
  try {
    response = await form(ctx);
  }
  catch (e) {
    log.error('Could not retrieve consent response', {error: e.message, stack: e.stack});
  }

  return response;
}

/**
 * Requests a check for existing user consent and continues the flow if it's found.
 * If no consent is found the user is redirected to the page where the consent can be made.
 *
 * @param {object} ctx
 * @param {function} next
 */
export async function retrieveUserConsent(ctx, next) {
  const user = ctx.getUser();
  const serviceClient = ctx.getState().serviceClient;

  if (user.userId && serviceClient.id) {
    const consent = await getConsent(ctx);

    if (consent) {
      addConsentToState(ctx, consent);
      await next();
    }
    else {
      ctx.redirect(`${VERSION_PREFIX}/login/consent`);
    }
  }
  else {
    await next();
  }
}

/**
 * Checks the storage for an existing consent which is added to the session if found. Otherwise false is returned.
 * Exported only to make testable.
 *
 * @param {string} userId
 * @param {string} serviceClientId
 * @return {object|boolean}
 */
export async function checkForExistingConsent({userId, serviceClientId}) {
  let consent = false;

  try {
    consent = await consentStore.read(`${userId}:${serviceClientId}`);
  }
  catch (e) {
    log.error('Failed check for existing consent', {error: e.message, stack: e.stack});
  }

  return consent;
}

/**
 * Stores the given consent in the storage.
 * Exported only to make testable.
 *
 * @param {object} ctx
 * @return {*}
 */
export async function storeUserConsent(ctx) {
  const consent = createConsentObject(ctx);
  const user = ctx.getUser();
  const state = ctx.getState();

  if (!user.userId) {
    log.error('Can not store consent without a userId');
    return false;
  }

  if (!state.serviceClient.id) {
    log.error('Can not store consent without a serviceClient ID');
    return false;
  }

  const consentid = `${user.userId}:${state.serviceClient.id}`;

  addConsentToState(ctx, consent);

  try {
    await consentStore.insert(consentid, consent);
  }
  catch (e) {
    log.error('Failed saving of user consent', {error: e.message, stack: e.stack});
  }
}

/**
 * Adds a consent object to the state object
 *
 * @param ctx
 * @param consent
 */
function addConsentToState(ctx, consent) {
  const state = ctx.getState();
  const consents = Object.assign({}, state.consents, {[state.serviceClient.id]: consent});
  ctx.setState({consents});
}

/**
 *
 * @param ctx
 * @returns {boolean}
 */
async function getConsent(ctx) {
  const user = ctx.getUser();
  const serviceClient = ctx.getState().serviceClient;
  let consent = false;
  try {
    consent = await checkForExistingConsent({userId: user.userId, serviceClientId: serviceClient.id});
    if (consent && JSON.stringify(consent) !== JSON.stringify(createConsentObject(ctx))) {
      await removeConsent(user.userId, serviceClient.id);
      consent = false;
    }
  }
  catch (e) {
    log.error('Error while retrieving user consent', {error: e.message, stack: e.stack});
  }

  return consent;
}

/**
 *
 * @param userId
 * @param serviceClientId
 */
async function removeConsent(userId, serviceClientId) {
  await consentStore.delete(`${userId}:${serviceClientId}`);
}

/**
 *
 * @param ctx
 * @returns {{keys: Array.<*>}}
 */
function createConsentObject(ctx) {
  const attributes = ctx.getState().serviceClient.attributes || {};
  const keys = Object.keys(attributes);
  return {keys: keys.sort()};
}

/**
 *
 * @param definitionAttributes
 * @param ticketAttributes
 * @returns {{}}
 */
function setConsentAttributes(definitionAttributes, ticketAttributes) {
  const consentAttributes = {};
  Object.keys(definitionAttributes).forEach((key) => {
    if (ticketAttributes[key] && ticketAttributes[key] !== []) {
      consentAttributes[key] = definitionAttributes[key];
      consentAttributes[key].key = key;
    }
  });
  return consentAttributes;
}
