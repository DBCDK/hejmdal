/**
 * @file
 * CULR compoennt handles all interaction bewteen the containing application and CULR
 */

import * as culr from './culr.client';
import {log} from '../../utils/logging.util';
import startTiming from '../../utils/timing.util';

/**
 * Retrieval of user identity/identities from CULR webservice
 *
 * @param {string} userId
 * @param {string} agencyId
 * @return {{}}
 */
export async function getUserAttributesFromCulr(user = {}, agencyId = null) {
  const {userId} = user;
  let attributes = {};
  let response = null;
  const stopTiming = startTiming();
  try {
    response = await culr.getAccountsByGlobalId({userIdValue: userId});
  } catch (e) {
    log.error('Request to CULR failed', {error: e.message, stack: e.stack});
    return attributes;
  }

  let responseCode = response.result.responseStatus.responseCode;
  if (responseCode === 'ACCOUNT_DOES_NOT_EXIST' && agencyId) {
    // Not found as global id, lets try as local id
    try {
      response = await culr.getAccountsByLocalId({
        userIdValue: userId,
        agencyId: agencyId
      });
      responseCode = response.result.responseStatus.responseCode;
    } catch (e) {
      log.error('Request to CULR failed', {error: e.message, stack: e.stack});
      return attributes;
    }
  }
  const elapsedTimeInMs = stopTiming();
  log.debug('timing', {service: 'Culr', ms: elapsedTimeInMs});

  if (responseCode === 'OK200') {
    attributes.accounts = response.result.Account;
    attributes.municipalityNumber = response.result.MunicipalityNo || null;
    attributes.culrId = response.result.Guid || null;
  } else if (responseCode === 'ACCOUNT_DOES_NOT_EXIST') {
    if (user.type === 'borchk') {
      // It should not be possible for a user authenticated through borchk,
      // not to exist in CULR. Therefore an error is logged.
      log.error('Borck user not in culr', {userId, agencyId});
    }
    log.info('Brugeren blev ikke fundet');
  } else {
    log.error('Der skete en fejl i kommuikationen med CULR', {
      response: response
    });
  }

  return attributes;
}
