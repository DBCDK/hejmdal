/**
 * @file
 */

import {form} from 'co-body';
import {CONFIG} from '../../utils/config.util';
import {log} from '../../utils/logging.util';
import KeyValueStorage from '../../models/keyvalue.storage.model';
import PersistentTicketStorage from '../../models/GateWayfTicket/gatewayfticket.persistent.storage.model';
import {getMockedGateWayfUrl, getMockedGateWayfResponse} from './mock/gatewayf.mock';

/**
 * Retrieving gatewayf response through co-body module
 *
 * @param ctx
 * @param idp
 * @returns {{userId: *}}
 */
export async function getGateWayfResponse(ctx, idp) {
  let userInfo = {userId: null, wayfId: null};
  try {
    const wayfObj = CONFIG.mock_externals[idp] ? getMockedGateWayfResponse(idp) : await form(ctx);
    userInfo = Array.isArray(wayfObj.id) ? await getWayfDataFromDb(wayfObj) : getWayfDataFromRedirect(wayfObj);
  }
  catch (e) {
    log.error('Could not retrieve ' + idp + ' response', {error: e.message, stack: e.stack});
  }

  return userInfo;

}

/**
 * Create url for gateWayf - either a mock for test og the production live url
 *
 * @param idp
 * @param token
 * @returns {*}
 */
export function getGateWayfUrl(idp, token) {
  return CONFIG.mock_externals[idp] ? getMockedGateWayfUrl(idp, token) : getLiveGateWayfUrl(idp, token);
}

/**
 * Extract user info from the wayf object
 *
 * @param wayfObj
 * @returns {{userId: *, wayfId: *}}
 */
function getWayfDataFromRedirect(wayfObj) {
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
async function getWayfDataFromDb(wayfTicket) {
  const storage = new KeyValueStorage(new PersistentTicketStorage());
  let id;
  let secret;
  // id = 10; secret = 'bdda523df71337adecfc783e87cfd1a62c3031f98a4d0cecb930e99d22bd2ade';
  if (Array.isArray(wayfTicket.id)) {
    id = wayfTicket.id[0];
  }
  if (Array.isArray(wayfTicket.secret)) {
    secret = wayfTicket.secret[0];
  }
  const gateWayfTicket = await storage.read(id, secret);
  return getWayfDataFromRedirect(gateWayfTicket);
}

/**
 * Create production url for gateWayf, with callback, idp and token
 *
 * @param idp
 * @param token
 * @returns {string}
 */
function getLiveGateWayfUrl(idp, token) {
  const base = CONFIG.gatewayf.uri;
  const returnUrl = `${CONFIG.app.host}/login/identityProviderCallback/${idp}/${token}`;
  const wayfIdp = CONFIG.gatewayf.idp[idp];

  return `${base}?idp=${wayfIdp}&returnUrl=${returnUrl}`;
}
