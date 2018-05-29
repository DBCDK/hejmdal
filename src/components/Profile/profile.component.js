/**
 * @file
 */

import {getText} from '../../utils/text.util';
import {CONFIG} from '../../utils/config.util';
import {findConsents} from '../Consent/consent.component';
import {getClientById} from '../Smaug/smaug.client';
import {log} from '../../utils/logging.util';

/**
 * Renders profile component
 *
 * @param ctx
 * @param next
 */
export async function profile(ctx, next) {
  const state = ctx.getState();
  const {serviceClient, smaugToken} = state;
  let consents = await findConsents(ctx);
  for (let i = 0; i < consents.length; i++) {
    const consent = consents[i];

    try {
      consent.name = (await getClientById(consent.serviceClientId)).displayName;
    }
    catch (err) {
      log.warn(`Could not find serviceClient for id ${consent.serviceClientId}`, {error: err.message, stack: err.stack});
    }
  }
  consents = consents.filter(consent => consent.name);
  await ctx.render('Profile', {
    consents,
    deleteConsentsAction: '/profile/confirmDeleteConsents',
    proceed: serviceClient && serviceClient.id !== CONFIG.smaug.hejmdalClientId ? {
      name: serviceClient.name,
      url: `/login?token=${smaugToken}`
    } : null,
    help: getText(['deleteConsents'])
  });
  await next();
}

/**
 * Renders consents deleted page
 *
 * @param ctx
 * @param next
 */
export async function consentsDeleted(ctx, next) {
  await ctx.render('ConsentsDeleted');
  await next();
}

/**
 * Renders consents deleted page
 *
 * @param ctx
 * @param next
 */
export async function confirmDeleteConsents(ctx, next) {
  await ctx.render('ConfirmDeleteConsents', {
    deleteConsentsAction: '/profile/deleteConsents',
    help: getText(['deleteConsents'])
  });
  await next();
}
