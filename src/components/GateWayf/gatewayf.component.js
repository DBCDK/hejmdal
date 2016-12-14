/**
 * @file
 */

import {form} from 'co-body';
import {CONFIG} from '../../utils/config.util';
import {VERSION_PREFIX} from '../../utils/version.util';
import {log} from '../../utils/logging.util';
import {getMockedGateWayfUrl, getMockedGateWayfResponse} from './mock/gatewayf.mock';

/**
 * Retrieving gatewayf response through co-body module
 *
 * @param ctx
 * @param idp
 * @returns {{userId: *}}
 */
export async function getGateWayfResponse(ctx, idp) {
  let cpr = null;
  let wayfId = null;
  try {
    const match = ':CPR:';
    const wayfObj = CONFIG.mock_externals[idp] ? getMockedGateWayfResponse(idp) : await form(ctx);
    if (Array.isArray(wayfObj.schacPersonalUniqueID)) {
      const cprPos = wayfObj.schacPersonalUniqueID[0].indexOf(match);
      if (cprPos !== -1) {
        cpr = wayfObj.schacPersonalUniqueID[0].substr(cprPos + match.length);
      }
    }
    if (Array.isArray(wayfObj.eduPersonTargetedID)) {
      wayfId = wayfObj.eduPersonTargetedID[0];
    }
  }
  catch (e) {
    log.error('Could not retrieve ' + idp + ' response', {error: e.message, stack: e.stack});
  }

  return {userId: cpr, wayfId: wayfId};

}

/**
 * Create url for gateWayf - either a mock for test og the production live url
 *
 * @param idp
 * @param token
 * @returns {*}
 */
export function getGateWayfUrl(idp, token) {
  return CONFIG.mock_externals[idp] ? getMockedGateWayfUrl(VERSION_PREFIX, idp, token) : getLiveGateWayfUrl(idp, token);
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
  const returnUrl = `${CONFIG.app.host}${VERSION_PREFIX}/login/identityProviderCallback/${idp}/${token}`;
  const wayfIdp = CONFIG.gatewayf.idp[idp];

  return `${base}?idp=${wayfIdp}&returnUrl=${returnUrl}`;
}
