/**
 * @file
 * CULR compoennt handles all interaction bewteen the containing application and CULR
 */

import * as culr from './culr.client';
import {log} from '../../utils/logging.util';

/**
 * Retrieval of user identity/identities from CULR webservice
 *
 * @param {string} userId
 * @param {string} agencyId
 * @return {{}}
 */
export async function getUserAttributesFromCulr(userId, agencyId = null) {
  let attributes = {};
  let response = null;

  try {
    response = await culr.getAccountsByGlobalId({userIdValue: userId});
  } catch (e) {
    log.error('Request to CULR failed', {error: e.message, stack: e.stack});
    return attributes;
  }

  let responseCode = response.result.responseStatus.responseCode;
  if ((responseCode === 'ACCOUNT_DOES_NOT_EXIST') && agencyId) { // Not found as global id, lets try as local id
    try {
      response = await culr.getAccountsByLocalId({userIdValue: userId, agencyId: agencyId});
      responseCode = response.result.responseStatus.responseCode;
      let cpr = null;
      if ((responseCode === 'OK200') && response.result.Account) {
        response.result.Account.forEach(account => {
          if (account.userIdType === 'CPR') {
            cpr = account.userIdValue;
          }
        });
      }
      if (cpr) { // found the users globalId. Now fetch all accounts
        response = await culr.getAccountsByGlobalId({userIdValue: cpr});
        responseCode = response.result.responseStatus.responseCode;
      }
    } catch (e) {
      log.error('Request to CULR failed', {error: e.message, stack: e.stack});
      return attributes;
    }
  }

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
