/**
 * @file
 *
 *  Maps data from CULR (and IDprovider) as specified by the Smaug-setting for the given serviceClient
 *
 */

import {log} from './logging.util';

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
      default:
        log.error('Cannot map attribute: ' + field);
        break;
    }
  });

  return mapped;
}

function mapFromCpr(cpr) {
  const ret = {};
  if (isNumeric(cpr) && isValidDate(cpr) && cpr.length === 10) {
    ret.birthDate = cpr.substr(0, 6);
    ret.birthYear = addMilenium(cpr.substr(4, 2), cpr.substr(6, 1));
    ret.gender = cpr.substr(9, 1) % 2 ? 'm' : 'f';
  }
  return ret;
}

/**
 *  Add milenium to 2 digit year as specified by https://da.wikipedia.org/wiki/CPR-nummer
 *
 * @param year - 2 digit year
 * @param seven - digit number 7 in the cpr
 */
function addMilenium(year, seven) {
  switch (seven) {
    case '0':
    case '1':
    case '2':
    case '3':
      return '19' + year;
    case '4':
    case '9':
      return (year >= 37 ? '19' : '20') + year;
    case '5':
    case '6':
    case '7':
    case '8':
      return (year >= 58 ? '18' : '20') + year;
    default:
      return '??' + year;
  }
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isValidDate(ddmmyy) {
  const mm = ddmmyy.substr(2, 2) || '00';
  const d = new Date(ddmmyy.substr(4, 2), mm - 1, ddmmyy.substr(0, 2));
  return d && (d.getMonth() + 1) === parseInt(mm, 10);
}

