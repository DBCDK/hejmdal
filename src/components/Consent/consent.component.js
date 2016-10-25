/**
 * @file
 * Consent component handling the nessecary consent
 */

import {form} from 'co-body';
import {VERSION_PREFIX} from '../../utils/version.util';
import {CONFIG} from '../../utils/config.util';
import consentTemplate from './templates/consent.template';
import KeyValueStorage from '../../models/keyvalue.storage.model';
import MemoryStorage from '../../models/memory.storage.model';
import PersistentConsentStorage from '../../models/Consent/consent.persistent.storage.model';
import {log} from '../../utils/logging.util';

const store = CONFIG.mock_externals.consent === 'memory' ?
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
  if (!state.serviceClient || !state.serviceClient.id) {
    ctx.redirect(`${VERSION_PREFIX}/fejl`);
  }
  else {
    ctx.body = consentTemplate({versionPrefix: VERSION_PREFIX, service: state.serviceClient.id});
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
    consentRejected(ctx, next);
  }
  else {
    await storeUserConsent(ctx);
    await next();
  }
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
 * Consent is rejected by user and the flow is halted.
 *
 * TODO Currently a message is displayed to the user but we should probably redirect the user somewhere
 * @param {object} ctx
 * @param {function} next
 */
export async function consentRejected(ctx, next) {
  const serviceClient = ctx.getState().serviceClient;
  ctx.redirect(`${serviceClient.urls.host}${serviceClient.urls.error}?message=consent%20was%20rejected`);
  await next();
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
    try {
      const consent = await checkForExistingConsent({userId: user.userId, serviceClientId: serviceClient.id});
      if (consent) {
        addConsentToState(ctx, consent);
        await next();
      }
      else {
        ctx.redirect(`${VERSION_PREFIX}/login/consent`);
      }
    }
    catch (e) {
      log.error('Error while retrieving user consent', {error: e.message, stack: e.stack});
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
 * @param {object} ctx
 * @return {object|null|boolean}
 */
export async function checkForExistingConsent({userId, serviceClientId}) {
  let consent = null;

  try {
    consent = await store.read(`${userId}:${serviceClientId}`);
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
  const consent = {}; // TODO retrieve from SMAUG
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
    await store.insert(consentid, consent);
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
