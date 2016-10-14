/**
 * @file
 * Consent component handling the nessecary consent
 */

import ConsentStore from './consent.store';
import {form} from 'co-body';
import {VERSION_PREFIX} from '../../utils/version.util';
import consentTemplate from './templates/consent.template';

const store = new ConsentStore();

/**
 * Renders the consent UI
 *
 * @param {object} ctx
 * @param {function} next
 */
export function giveConsentUI(ctx, next) {
  ctx.body = consentTemplate({service: ctx.session.state.service});
  next();
}

/**
 * Submit handler for consent submission. If consent is rejected consentRejected is invoked. It it's accepted the
 * consent is requested to be saved and the flow is continued.
 *
 * @param {object} ctx
 * @param {function} next
 */
export async function consentSubmit(ctx, next) {
  const response = await form(ctx);
  if (response.userconsent && response.userconsent === '0') {
    consentRejected(ctx, next);
  }
  else {
    const service = ctx.session.state.service;
    ctx.session.state.consents[service] = true;
    // TODO request wrtie of consent to storage
    next();
  }
}

/**
 * Consent is rejected by user and the flow is halted.
 *
 * TODO Currently a message is displayed to the user but we should probably redirect the user somewhere
 * @param {object} ctx
 * @param {function} next
 */
export async function consentRejected(ctx, next) {
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
    console.log('Existing consent not found');
  }
}

/**
 * Checks the storage for an existing consent which is added to the session if found. Otherwise false is returned.
 *
 * @param {object} ctx
 * @return {boolean}
 */
async function checkForExistingConsent(ctx) {
  const consent = await store.getConsent(ctx.session.state.user.cpr);
  console.log('checkForExistingConsent: ', consent);
  // TODO do some checks and ensure that the user has given consent for exactly the actual service
  return consent;
}

/**
 * Stores the given consent in the storage.
 *
 * @param ctx
 * @return {*}
 */
async function saveUserConsent(ctx) {
  // TODO write consents to storeage
  const consent = await store.setConsent();
  return consent;
}
