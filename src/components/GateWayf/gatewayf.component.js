/**
 * @file
 */

import {CONFIG} from '../../utils/config.util';
import {log} from '../../utils/logging.util';
import KeyValueStorage from '../../models/keyvalue.storage.model';
import PersistentTicketStorage from '../../models/GateWayfTicket/gatewayfticket.persistent.storage.model';
import {
  getMockedGateWayfLoginResponse,
  getMockedGateWayfLoginUrl,
  getMockedGateWayfLogoutUrl
} from './mock/gatewayf.mock';
import {isValidCpr} from '../../utils/cpr.util';
import {getAgencyByCpr} from '../Culr/culr.component';

/**
 * Retrieving gatewayf response through co-body module
 *
 * Handling old scheme where the userdata is send as POST data
 * and
 * new scheme, where gateWayf stores the userdata in a pg db and POST a ticket to this information
 *
 * Garbage collection of the gateWayf Ticket is handled by gateWayf
 *
 * @param req
 * @param idp
 * @returns {{userId: *}}
 */
export async function getGateWayfLoginResponse(req, idp) {
  let userInfo = {userId: null, wayfId: null};
  try {
    const wayfObj = CONFIG.mock_externals[idp]
      ? getMockedGateWayfLoginResponse(idp)
      : req.body;
    userInfo = Array.isArray(wayfObj.id)
      ? await getUserDataFromDb(wayfObj)
      : getUserDataFromWayfObject(wayfObj);
  } catch (e) {
    log.error('Could not retrieve ' + idp + ' response', {
      error: e.message,
      stack: e.stack
    });
  }

  return userInfo;
}

/**
 * Create login url for gateWayf - either a mock for test og the production live url
 *
 * @param idp
 * @param token
 * @returns {*}
 */
export function getGateWayfLoginUrl(idp, token) {
  return CONFIG.mock_externals[idp]
    ? getMockedGateWayfLoginUrl(idp, token)
    : getLiveGateWayfLoginUrl(idp, token);
}

/**
 * Create logout url for gateWayf - either a mock for test og the production live url
 *
 * @returns {*}
 */
export function getGateWayfLogoutUrl() {
  return CONFIG.mock_externals.nemlogin
    ? getMockedGateWayfLogoutUrl()
    : getLiveGateWayfLogoutUrl();
}

/**
 * Extract user info from the wayf object
 *
 * @param wayfObj
 * @returns {{userId: *, wayfId: *}}
 */
function getUserDataFromWayfObject(wayfObj) {
  let cpr = null;
  let wayfId = null;
  if (Array.isArray(wayfObj.schacPersonalUniqueID)) {
    const match = ':CPR:';
    const cprPos = wayfObj.schacPersonalUniqueID[0].indexOf(match);
    if (cprPos !== -1) {
      cpr = wayfObj.schacPersonalUniqueID[0].substr(cprPos + match.length);
    }
  }
  if (Array.isArray(wayfObj.eduPersonTargetedID)) {
    wayfId = wayfObj.eduPersonTargetedID[0];
  }
  return {userId: cpr, wayfId: wayfId};
}

/**
 * Fetch userinfo from gateWayf in database
 *
 * @param wayfTicket
 * @returns {{userId, wayfId}|{userId: *, wayfId: *}}
 */
async function getUserDataFromDb(wayfTicket) {
  const storage = new KeyValueStorage(new PersistentTicketStorage());
  let id;
  let secret;
  if (Array.isArray(wayfTicket.id)) {
    id = wayfTicket.id[0];
  }
  if (Array.isArray(wayfTicket.secret)) {
    secret = wayfTicket.secret[0];
  }
  const gateWayfTicket = await storage.readUnencryptedData(id, secret);
  if (gateWayfTicket === null) {
    log.error('Could not read gateWayf ticket id: ' + id);
    return {userId: null, wayfId: null};
  }
  await storage.delete(id);
  return getUserDataFromWayfObject(gateWayfTicket);
}

/**
 * Create production login url for gateWayf, with callback, idp and token
 *
 * @param idp
 * @param token
 * @returns {string}
 */
function getLiveGateWayfLoginUrl(idp, token) {
  const base = CONFIG.gatewayf.uri;
  const returnUrl = `${
    CONFIG.app.host
  }/login/identityProviderCallback/${idp}/${token}`;
  const wayfIdp = CONFIG.gatewayf.idp[idp];

  return `${base}?idp=${wayfIdp}&returnUrl=${returnUrl}`;
}

/**
 * Create production logout url for gateWayf, with callback
 *
 * @returns {string}
 */
function getLiveGateWayfLogoutUrl() {
  const base = CONFIG.gatewayf.uri;
  const returnUrl = encodeURIComponent(`${CONFIG.app.host}/logout`);

  return `${base}?op=logout&returnUrl=${returnUrl}`;
}

/**
 * Parses the callback parameters for nemlogin (via gatewayf).
 *
 * @param req
 */
export async function nemloginCallback(req) {
  const response = await getGateWayfLoginResponse(req, 'nemlogin');
  const cpr = isValidCpr(response.userId) ? response.userId : null;
  const agency = (await getAgencyByCpr(cpr)) || null;

  req.setUser({
    userId: response.userId,
    cpr,
    userType: 'nemlogin',
    agency
  });

  return req;
}

/**
 * Parses the call parameters for wayf (via gatewayf)
 * @param req
 */
export async function wayfCallback(req) {
  const response = await getGateWayfLoginResponse(req, 'wayf');

  req.setUser({
    userId: response.userId || response.wayfId, // If userId ist not set we have to use wayfId as userId #190
    wayfId: response.wayfId,
    userType: 'wayf'
  });

  return req;
}
