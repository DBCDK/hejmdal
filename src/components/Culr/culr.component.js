/**
 * @file
 * CULR compoennt handles all interaction bewteen the containing application and CULR
 */

import * as culr from './culr.client';
import {log} from '../../utils/logging.util';

export async function getCulrAttributes(ctx, next) { // eslint-disable-line
  const userId = ctx.getUser().userId || null;
  let culrAttributes = {};

  if (userId) {
    culrAttributes = await getUserAttributesFromCulr(userId);
  }
  ctx.setState({culr: culrAttributes});
  next();
}

/**
 * Dummy method that fakes retrieval of user from CULR webservice
 *
 * @param userId
 * @return {{}}
 */
async function getUserAttributesFromCulr(userId) {
  let attributes = {};
  let response = null;

  try {
    response = await culr.getAccounts({userIdValue: userId});
  }
  catch (e) {
    log.error('Response to CULR failed', {error: e.message, stack: e.stack});
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
