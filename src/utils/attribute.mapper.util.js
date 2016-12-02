/**
 * @file
 *
 *  Maps data from CULR (and IDprovider) as specified by the Smaug-setting for the given serviceClient
 *
 */

import {log} from './logging.util';
import {mapFromCpr} from './cpr.util';

/**
 * Attribute mapper
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export default async function mapAttributesToTicket(ctx, next) {
  const state = ctx.getState();
  const user = ctx.getUser();

  if (state && state.serviceClient && state.culr) {
    const serviceAttributes = state.serviceClient.attributes;
    const culr = state.culr;

    const ticketAttributes = mapCulrResponse(culr, serviceAttributes, user);

    ctx.setState({ticket: {attributes: ticketAttributes}});
  }

  await next();
}

/**
 * Maps the response from CULR according to the given array of fields
 *
 * @param {object} culr The CULR reponse object
 * @param {object} attributes The attributes object defined in Smaug
 * @see ATTRIBUTES
 * @return {{}}
 */
function mapCulrResponse(culr, attributes, user) {
  let mapped = {};

  let cpr = user.cpr || null;
  let libraries = [];
  let fromCpr = {};

  if (culr.accounts && Array.isArray(culr.accounts)) {
    culr.accounts.forEach((account) => {
      if (account.userIdType === 'CPR' && !cpr) {
        cpr = account.userIdValue;
      }

      libraries.push({
        libraryid: account.provider,
        loanerid: account.userIdValue
      });
    });
  }
  if (cpr) {
    fromCpr = mapFromCpr(cpr);
  }

  const fields = Object.keys(attributes);
  fields.forEach((field) => {
    switch (field) {
      case 'birthDate':
      case 'birthYear':
      case 'gender':
        mapped[field] = fromCpr[field] || null;
        break;
      case 'cpr':
        mapped.cpr = cpr;
        break;
      case 'libraries':
        mapped.libraries = libraries;
        break;
      case 'municipality':
        mapped.municipality = culr.municipalityNumber || null;
        break;
      case 'uniloginId':
        mapped.uniloginId = user.userType === 'unilogin' && user.userId ? user.userId : null;
        break;
      case 'wayfId':
        mapped.wayfId = user.wayfId ? user.wayfId : null;
        break;
      default:
        log.error('Cannot map attribute: ' + field);
        break;
    }
  });

  return mapped;
}
