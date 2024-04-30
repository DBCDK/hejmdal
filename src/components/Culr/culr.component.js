/**
 * @file
 * CULR component handles all interaction between the containing application and CULR
 */

import * as culr from './culr.client';
import {log} from '../../utils/logging.util';
import {validateUserInLibrary} from '../Borchk/borchk.component';
import {CONFIG} from '../../utils/config.util';
import {borchkUserIdIsGlobal} from '../../utils/cpr.util';
import {populateCulr} from '../../utils/populateCulr.util';
import {getAgencyFromMunicipality} from '../../utils/vipCore.util';
import {sortBy} from 'lodash';


/**
 * Retrieval of user identity/identities from CULR webservice
 *
 * @param {Object} user
 * @param createCulrAccountAgency
 * @param useBorchk
 * @returns {Promise<{}>}
 */
export async function getUserAttributesFromCulr(user = {}, createCulrAccountAgency = null, useBorchk = true) {
  const {userId, agency: agencyId = null} = user;
  let attributes = {};
  let response = null;
  let responseCode;

  const account = await getUserAccount(userId, agencyId);
  if (!account || !account.response) {
    return  {errorCulr: true};
  }

  // set user account informations
  response = account.response;
  responseCode = account.responseCode;

  // Check if we should create an account (If is NOT in CULR)
  if (shouldCreateAccount(agencyId, user, response, createCulrAccountAgency)) {
    // It should not have been possible for a user to have authenticated through borchk,
    // and not to exist in CULR. Therefore a warning is logged.
    log.warn('Borck user not in culr', {userId: userId, agency: agencyId});

    try {
      const createUserResponse = await createUser(user, createCulrAccountAgency ?? agencyId);
      const newAccount = await getUserAccount(userId, createCulrAccountAgency ?? agencyId);

      // set user account informations
      response = newAccount.response;
      responseCode = newAccount.responseCode;
    } catch (error) {
      log.error('Could not create User in CULR', {
        userId: userId,
        agency: agencyId,
        errorMessage: error.message,
        stack: error.stack
      });
    }
  }

  let culrResult = {};
  if (responseCode === 'OK200') {
    attributes.accounts = response.result.Account;
    attributes.culrId = response.result.Guid || null;
    culrResult = response.result;
  }
  if (useBorchk) {
    addUserInfoToAttributes(attributes, await getUserInfoFromBorchk(culrResult, user));
  }
  return attributes;
}

/**
 *
 * @param attributes
 * @param userInfo
 */
function addUserInfoToAttributes(attributes, userInfo) {
  if (userInfo && Object.keys(userInfo).length > 0) {
    attributes.errorBorchk = userInfo.errorBorchk || false;
    attributes.errorCulr = userInfo.errorCulr || false;
    attributes.blocked = userInfo.blocked || false;
    attributes.userPrivilege = userInfo.userPrivilege || [];
    attributes.municipalityNumber = userInfo.municipalityNumber || null;
    attributes.municipalityAgencyId = userInfo.municipalityAgencyId || null;
  }
}

/**
 * Fetches the users account
 *
 * Fetch account by a global-id, unless the agency use non global userId's (like 800010)
 * - then with local-id as fallback
 *
 * @param {String} userId
 * @param {String} agencyId
 * @returns {Promise<null|{response: *, responseCode: *}>}
 */
async function getUserAccount(userId, agencyId) {
  let response = null;
  let responseCode = null;

  try {
    if (borchkUserIdIsGlobal(agencyId)) {
      response = await culr.getAccountsByGlobalId({uidValue: userId});
      responseCode = response && response.result.responseStatus.responseCode;
    }

    if (agencyId && (responseCode === 'ACCOUNT_DOES_NOT_EXIST' || !borchkUserIdIsGlobal(agencyId))) {
      // Not found (or usable) as global id, lets try as local id
      response = await culr.getAccountsByLocalId({userIdValue: userId, agencyId});
      responseCode = response && response.result.responseStatus.responseCode;
    }

    return {response, responseCode};
  } catch (e) {
    log.error('Request to CULR failed', {error: e.message, stack: e.stack});
    return {error: e.message};
  }
}

/**
 * Get municipality for user.
 *
 * We can only get municipality if user has logged in through library in municipality.
 *
 * @param {*} user
 * @returns {string|null}
 */
export async function getBorchkInfo(user) {
  const result = await validateUserInLibrary(
    CONFIG.borchk.serviceRequester,
    user
  );
  return result;
}

/**
 * Find municipality Number and Municipality Agency
 *
 * We can only get municipality if user has logged in through borchk or is found in CULR
 *
 * @param {Object} culrResponse
 * @param {Object} user
 * @returns {Promise<{}>}
 */
export async function getUserInfoFromBorchk(culrResponse, user) {
  let response = {};

  try {
    // Check for user municipality
    if (user.agency && user.userId && user.pincode) {
      const borchkInfo = await getBorchkInfo(user);
      if (borchkInfo) {
        if (borchkInfo.error) {
          response.errorBorchk = true;
        }
        else {
          response.blocked = borchkInfo.blocked || null;
          response.userPrivilege = borchkInfo.userPrivilege || null;
          if (borchkInfo.municipalityNumber) {
            response.municipalityNumber = borchkInfo.municipalityNumber;
            if (borchkInfo.municipalityNumber.match(/^[1-8][0-9]{2}$/)) {
              // Set municipalityAgency from municipalityNumber since this can be different than the login agency
              // As such, we do not know if the user is registered at the municipalityAgency when it differs from the login agency
              response.municipalityAgencyId = await setMunicipalityAgency(borchkInfo.municipalityNumber);
              log.info('municipality info. borchk: ', response);
              return response;
            }
          }
        }
      }
    }

    if (culrResponse.MunicipalityNo && !isNaN(culrResponse.MunicipalityNo)) {
      response.municipalityNumber = culrResponse.MunicipalityNo;
      if (user.agency && !user.agency.startsWith('7')) {
        log.debug('Ignore CULR info when setting municipalityAgencyId', user.agency, culrResponse.MunicipalityNo);
        response.municipalityAgencyId = user.agency;
      } else {
        response.municipalityAgencyId = await setMunicipalityAgency(culrResponse.MunicipalityNo);
      }
      log.info('municipality info. culr: ', response);
    }
    else {
      // Municipality not found in borchk or culr
      /* HEJMDAL-685 HEJMDAL-691 HEJMDAL-692 */
      // Supporting a hack. Currently for 100450: 'Test' and, 790900: 'DBC Test bibliotek'',
      // to give them a municipality agency, and for 790900 a municipality number
      const municipalityHack = CONFIG.municipalityHack.replace(/[^\d]+/g, ' ').trim().split(' ');
      if (municipalityHack.includes(user.agency)) {
        response.municipalityAgencyId = user.agency;
        if (user.agency.startsWith('7')) {
          response.municipalityNumber = user.agency.slice(1, 4).replace(/^[0]+/, '');
        }
        log.info('municipality info. fallback: ', response);
      }
    }
    return response;
  } catch (e) {
    log.error('could not generate attributes', {
      error: e.message,
      stack: e.stack
    });
  }
}

/** return the agencyId corresponding to a given municipality number
 *
 * @param municipality {string}
 * @returns {string|null}
 */
async function setMunicipalityAgency(municipality) {
  return await getAgencyFromMunicipality(municipality) ?? (municipality.length === 3 ? `7${municipality}00` : null);
}

/**
 * Create user on CULR.
 *
 * @param {*} user
 * @param {*} agencyId
 * @returns Boolean
 */
async function createUser(user, agencyId) {
  // Check if required data exists
  if (!agencyId) {
    return false;
  }

  if (!(user.cpr || user.userId)) {
    return false;
  }

  // If user has no CPR set userIdType to 'LOCAL'
  const userIdType = user.cpr ? 'CPR' : 'LOCAL';
  const userIdValue = user.cpr ? user.cpr : user.userId;

  // Check if user has logged in on municipality
  // Create user on CULR.
  const borchkInfo = (user.agency === agencyId) ? await getBorchkInfo(user) : {};
  const response = await culr.createAccount({
    userIdType,
    userIdValue,
    agencyId,
    municipalityNo: borchkInfo.municipalityNumber ?? null
  });

  const responseCode = response && response.return.responseStatus.responseCode;

  if (responseCode === 'OK200') {
    return true;
  }
  log.error('user not created in CULR', {
    culrResponse: JSON.stringify(response),
    userData: JSON.stringify(user),
    agencyId
  });
  return false;
}

/**
 * Util function for checking if library is registrered on Culr profile
 *
 * @param {String} library
 * @param {Object} user
 * @param {Object} response
 * @param {String} createCulrAccountAgency
 * @returns {boolean}
 */
export function shouldCreateAccount(library, user, response, createCulrAccountAgency = null) {
  const responseCode = response && response.result && response.result.responseStatus.responseCode;
  if (createCulrAccountAgency && (responseCode === 'ACCOUNT_DOES_NOT_EXIST') && !!user.cpr) {
    return true;
  }

  if (!library || !populateCulr[library]) {
    return false;
  }

  if (user.userType !== 'borchk') {
    return false;
  }

  if (responseCode === 'ACCOUNT_DOES_NOT_EXIST') {
    return true;
  }

  if (response && response.result && response.result.Account) {
    return (
      response.result.Account.filter(a => a.provider === library).length === 0
    );
  }

  return false;
}

/**
 * Retrieves a 'best-match' user agency if none municipalityAgency is set
 *
 * @param {String} cpr
 * @returns {string} agency
 */

export async function getAgencyByCpr(cpr) {
  if (!cpr) {
    return null;
  }

  // Fetching user
  const response = await culr.getAccountsByGlobalId({
    uidValue: cpr
  });

  // Fetch user result
  const result = response && response.result;

  if (result.responseStatus.responseCode === 'OK200') {
    // If user found but has no agency relations
    if (!result.Account || result.Account.length === 0) {
      return null;
    }

    let match = null;
    const municipalityNo = result.MunicipalityNo || null;

    if (municipalityNo) {
      // If a municipalityNo was found - return a MunicipalityAgencyId based on the users MunicipalityNo
      return `7${municipalityNo}00`;
    }

    // If NO municipalityNo was found - Remove forbidden/unwanted agencies from provider result
    match = filterAgencies(result.Account);

    if (match.length > 1) {
      // Sort best-match providers if more than one provider is available
      match = sortAgencies(match, municipalityNo)[0];
    }

    // Return provider from best-match
    if (match && match.provider) {
      return match.provider;
    }

    return null;
  }

  return null;
}

/**
 * Function that filters agencies (From culr response)
 *
 * Providers listed in the 'blacklist' array, will be removed from the given agencies list.
 *
 * @param {Array} agencies
 * @returns {Array}
 */

export function filterAgencies(agencies) {
  // Providers which is not allowed to be returned
  const blacklist = ['190110'];

  return agencies.filter(agency => !blacklist.includes(agency.provider));
}

/**
 * Function that sorts agencies (From culr response) in a priority order
 *
 * agency with provider including the MunicipalityNo is 1. sort priority
 * agency with type of CPR is. 2. sort priority
 *
 * @param {Array} agencies
 * @param {String} municipalityNo
 * @returns {Array}
 */

export function sortAgencies(agencies, municipalityNo) {
  return sortBy(agencies, [
    o => (o.provider.includes(municipalityNo) ? -1 : +1),
    'userIdType'
  ]);
}
