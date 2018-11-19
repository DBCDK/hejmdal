/**
 * @file
 * CULR compoennt handles all interaction bewteen the containing application and CULR
 */

import * as culr from './culr.client';
import {log} from '../../utils/logging.util';

/**
 * Retrieval of user from CULR webservice
 *
 * @param {string} userId
 * @return {{}}
 */
export async function getUserAttributesFromCulr(userId) {
  let attributes = {};
  let response = null;

  try {
    response = await culr.getAccountsByGlobalId({userIdValue: userId});
  } catch (e) {
    log.error('Request to CULR failed', {error: e.message, stack: e.stack});
    return attributes;
  }

  const responseCode = response.result.responseStatus.responseCode;

  if (responseCode === 'OK200') {
    attributes.accounts = response.result.Account;
    attributes.municipalityNumber = response.result.MunicipalityNo || null;
    attributes.culrId = response.result.Guid || null;
  } else if (responseCode === 'ACCOUNT_DOES_NOT_EXIST') {
    log.info('Brugeren blev ikke fundet');
  } else {
    log.error('Der skete en fejl i kommuikationen med CULR', {
      response: response
    });
  }

  return attributes;
}
