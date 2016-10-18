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
export function giveConsentUI(ctx, next) {
  if (!ctx.session.state || !ctx.session.state.service) {
    ctx.redirect(`${VERSION_PREFIX}/fejl`);
  }
  else {
    ctx.body = consentTemplate({service: ctx.session.state.service});
    next();
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
    storeUserConsent(ctx);
    next();
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
    log.error('Could not retrieve consent response', {error: e, stack: e.stack});
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
export function consentRejected(ctx, next) {
  ctx.body = 'Consent rejected. What to do...?';
  next();
}

/**
 * Requests a check for existing user consent and continues the flow if it's found.
 * If no consent is found the user is redirected to the page where the consent can be made.
 *
 * @param {object} ctx
 * @param {function} next
 */
export async function retrieveUserConsent(ctx, next) {
  if (await checkForExistingConsent(ctx)) {
    next();
  }
  else {
    ctx.redirect(`${VERSION_PREFIX}/login/consent`);
  }
}

/**
 * Checks the storage for an existing consent which is added to the session if found. Otherwise false is returned.
 *
 * @param {object} ctx
 * @return {boolean}
 */
async function checkForExistingConsent(ctx) {
  const consent = await store.read(`${ctx.session.state.user.cpr}:${ctx.session.state.service}`);
  // TODO do some checks and ensure that the user has given consent for exactly the actual service
  if (consent) {
    ctx.session.state.consents[ctx.session.state.service] = consent;
  }

  return consent;
}

/**
 * Stores the given consent in the storage.
 *
 * @param {object} ctx
 * @return {*}
 */
async function storeUserConsent(ctx) {
  const consent = {}; // TODO retrieve from SMAUG
  ctx.session.state.consents[ctx.session.state.service] = consent;
  const consentid = `${ctx.session.state.user.cpr}:${ctx.session.state.service}`;
  await store.insert(consentid, consent);
}
