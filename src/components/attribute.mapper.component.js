/**
 * @file
 *
 *  Maps data from CULR (and IDprovider) as specified by the Smaug-setting for the given serviceClient
 *
 */

import {log} from '../utils/logging.util';

/**
 * Attribute mapper
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export default function mapAttributesToTicket(ctx, next) {
  const state = ctx.getState();

  if (state && state.serviceClient && state.culr) {
    const serviceAttributes = state.serviceClient.attributes;
    const culr = state.culr;

    const ticketAttributes = mapCulrResponse(culr, serviceAttributes);

    ctx.setState({ticket: {attributes: ticketAttributes}});
  }

  return next();
}

/**
 * Maps the response from CULR according to the given array of fields
 *
 * @param {object} culr The CULR reponse object
 * @param {Array} fields The array of fields defined in Smaug
 * @return {{}}
 */
function mapCulrResponse(culr, fields) {
  let mapped = {};

  let cpr = null;
  let libraries = [];
  let fromCpr = {};

  if (culr.accounts && Array.isArray(culr.accounts)) {
    culr.accounts.forEach((account) => {
      if (account.userIdType === 'CPR' && !cpr) {
        cpr = account.userIdValue;
        fromCpr = mapFromCpr(cpr);
      }

      libraries.push({
        libraryid: account.provider,
        loanerid: account.userIdValue
      });
    });
  }

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
      default:
        log.error('Cannot map attribute: ' + field);
        break;
    }
  });

  return mapped;
}

function mapFromCpr(cpr) {
  const ret = {};
  if (isNumeric(cpr) && isValidDate(cpr)) {
    ret.birthDate = cpr.substr(0, 6);
    ret.birthYear = cpr.substr(4, 2);
    ret.gender = cpr.substr(9, 1) % 2 ? 'm' : 'f';
  }
  return ret;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isValidDate(ddmmyy) {
  const mm = ddmmyy.substr(2, 2) || '00';
  const d = new Date(ddmmyy.substr(4, 2), mm - 1, ddmmyy.substr(0, 2));
  return d && (d.getMonth() + 1) === parseInt(mm, 10);
}

