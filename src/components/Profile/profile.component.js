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
 * @param req
 * @param res
 */
export async function profile(req, res) {
  const state = req.getState();
  const {serviceClient, smaugToken} = state;
  let consents = await findConsents(req.getUser().userId);
  for (let i = 0; i < consents.length; i++) {
    const consent = consents[i];

    try {
      consent.name = (await getClientById(consent.serviceClientId)).displayName;
    } catch (err) {
      log.warn(
        `Could not find serviceClient for id ${consent.serviceClientId}`,
        {error: err.message, stack: err.stack}
      );
    }
  }
  consents = consents.filter(consent => consent.name);

  const proceed = {
    name: serviceClient.name,
    url: `/login?token=${smaugToken}`
  };

  await res.render('Profile', {
    consents,
    deleteConsentsAction: '/profile/confirmDeleteConsents',
    proceed:
      serviceClient && serviceClient.id !== CONFIG.smaug.hejmdalClientId
        ? proceed
        : null,
    help: getText(['deleteConsents'])
  });
}

/**
 * Renders consents deleted page
 *
 * @param req
 * @param res
 */
export async function consentsDeleted(req, res) {
  req.session.destroy();
  res.render('ConsentsDeleted');
}

/**
 * Renders consents deleted page
 *
 * @param req
 * @param res
 */
export async function confirmDeleteConsents(req, res) {
  await res.render('ConfirmDeleteConsents', {
    deleteConsentsAction: '/profile/deleteConsents',
    help: getText(['deleteConsents'])
  });
}
