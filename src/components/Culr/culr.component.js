/**
 * @file
 * CULR compoennt handles all interaction bewteen the containing application and CULR
 */

import * as culr from './culr.client';
import {log} from '../../utils/logging.util';

/**
 * If a userId is found a request will be submitted to CULR otherwise an empty object is returned.
 *
 * @param {object} ctx
 * @param {function} next
 */
export async function getCulrAttributes(ctx, next) {
  const userId = ctx.getUser().userId || null;

  let culrAttributes = {};

  if (userId) {
    culrAttributes = await getUserAttributesFromCulr(userId);
    ctx.setState({culr: culrAttributes});
  }

  await next();
}

/**
 * Retrieval of user from CULR webservice
 *
 * @param {string} userId
 * @return {{}}
 */
async function getUserAttributesFromCulr(userId) {
  let attributes = {};
  let response = null;

  try {
    response = await culr.getAccountsByGlobalId({userIdValue: userId});
  }
  catch (e) {
    log.error('Request to CULR failed', {error: e.message, stack: e.stack});
    return attributes;
  }

  const responseCode = response.result.responseStatus.responseCode;

  if (responseCode === 'OK200') {
    attributes.accounts = response.result.Account;
    attributes.municipalityNumber = response.result.MunicipalityNo || null;
  }
  else if (responseCode === 'ACCOUNT_DOES_NOT_EXIST') {
    log.info('Brugeren blev ikke fundet');
  }
  else {
    log.error('Der skete en fejl i kommuikationen med CULR', {response: response});
  }

  return attributes;
}
