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
 *
 * @param {object} ctx
 * @param {function} next
 */
export function giveConsentUI(ctx, next) {
  ctx.body = consentTemplate({service: ctx.session.state.service});
  next();
}

/**
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
 * Consent is rejected by user and the flow is interrupted.
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
 * Cheke
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

async function checkForExistingConsent(ctx) {
  const consent = await store.getConsent(ctx.session.state.user.cpr);
  console.log('checkForExistingConsent: ', consent);
  // TODO do some checks and ensure that the user has given consent for exactly the actual service
  return consent;
}

async function saveUserConsent(ctx) {
  // TODO write consents to storeage
  const consent = await store.setConsent();
  return consent;
}
