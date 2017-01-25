/**
 * @file
 * Provides UNI-Login integration
 */

import moment from 'moment';

import {md5} from '../../utils/hash.utils';
import {CONFIG} from '../../utils/config.util';
import {log} from '../../utils/logging.util';

/**
 * Genereates and returns a url to be used for login using UNI-Login
 *
 * @param {string} token
 * @return {string}
 */
export function getUniloginURL(token) {
  return CONFIG.mock_externals.unilogin ? getMockedUniloginUrl(token) : getLiveUniloginUrl(token);
}

/**
 * Validates the unilogin ticket aganst a series of underlying methods.
 *
 * @param {string} auth
 * @param {string} timestamp
 * @param {string} user
 * @return {boolean} boolean that indicates if the ticket was successfully validated
 */
export function validateUniloginTicket({auth, timestamp, user}) {
  return validateTicketAge({timestamp}) && validateTicketFingerPrint(auth, timestamp, user);
}

/**
 * Validates the given tickets fingerprint. Returns true if fingerprint is succesfully validated, otherwise false.
 *
 * @param {string} auth
 * @param {string} timestamp
 * @param {string} user
 * @return {boolean} {boolean}
 */
function validateTicketFingerPrint(auth, timestamp, user) {
  const valid = md5(timestamp + CONFIG.unilogin.secret + user) === auth;
  if (!valid) {
    log.error('Ticket fingerprint could not be verified', {ticket: {auth, timestamp, user}});
  }

  return valid;
}

/**
 * Validates the age of the ticket. If the ticket is younger than the max age specifies (default=60 secs) true will
 * be returned, otherwise false.
 *
 * @param ticket
 * @return {boolean}
 */
function validateTicketAge(ticket) {
  const timestamp = moment.utc(ticket.timestamp, 'YYYYMMDDHHmmss').format('X');
  const now = moment().utc().format('X');
  const age = parseInt(now, 10) - parseInt(timestamp, 10);
  return age <= CONFIG.unilogin.maxTicketAge;
}

function getMockedUniloginUrl(token) {
  const user = 'test1234';
  const timestamp = moment().utc().format('YYYYMMDDHHmmss');
  const auth = md5(timestamp + CONFIG.unilogin.secret + user);

  return `/login/identityProviderCallback/unilogin/${token}?auth=${auth}&timestamp=${timestamp}&user=${user}`;
}

/**
 * Constructs the URL that should be used to redirect the user to UNI-Login
 *
 * @param token
 * @return {string}
 */
function getLiveUniloginUrl(token) {
  const base = CONFIG.unilogin.uniloginBasePath;
  const returUrl = getReturUrl(token);
  const path = encodeURIComponent(new Buffer(returUrl).toString('base64'));
  const auth = md5(returUrl + CONFIG.unilogin.secret);

  return `${base}?id=${CONFIG.unilogin.id}&returURL=${returUrl}&path=${path}&auth=${auth}`;
}

/**
 * Constructs the URL that the user will be redirected to upon successful login at UNI-Login.
 *
 * @param token
 * @return {string}
 */
function getReturUrl(token) {
  return `${CONFIG.app.host}/login/identityProviderCallback/unilogin/${token}`;
}
