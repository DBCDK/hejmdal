/**
 * @file
 * CULR compoennt handles all interaction bewteen the containing application and CULR
 */

import * as culr from './culr.client';

export function getCulrAttributes(ctx, next) { // eslint-disable-line
  const userId = ctx.session.user.userId || null;
  const culrAttributes = getUserAttributesFromCulr(userId);
  ctx.session.culr = culrAttributes;
  next();
}

/**
 * Dummy method that fakes retrieval of user from CULR webservice
 *
 * @param userId
 * @return {{error: null|string, user: null|object}}
 */
async function getUserAttributesFromCulr(userId) {
  const result = {
    error: null,
    user: null
  };

  let accounts = null;

  try {
    accounts = await culr.getAccounts({userIdType: 'CPR', userIdValue: ''});
  }
  catch (e){
    console.log('catch', e);
  }

  const responseCode = accounts.result.responseStatus.responseCode;
  console.log('responseCode: ', responseCode);

  if(responseCode === 'OK200') {
    console.log('accounts.result', accounts.result.Account);
    result.user = accounts.result.Account;
  } else if(responseCode === 'ACCOUNT_DOES_NOT_EXIST') {
    result.error = 'brugeren findes ikke';
  } else {
    result.error = 'fejl';
  }

  return result;
}
