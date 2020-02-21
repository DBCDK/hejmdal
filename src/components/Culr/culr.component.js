/**
 * @file
 * CULR compoennt handles all interaction bewteen the containing application and CULR
 */

import * as culr from './culr.client';
import {log} from '../../utils/logging.util';
import {validateUserInLibrary} from '../Borchk/borchk.component';
import {CONFIG} from '../../utils/config.util';
import {municipalityName} from '../../utils/municipality.util';
import {sortBy} from 'lodash';

/**
 * Retrieval of user identity/identities from CULR webservice
 *
 * @param {Object} user
 * @param {string} agencyId
 * @return {{}}
 */
export async function getUserAttributesFromCulr(user = {}) {
  const {userId, agency: agencyId = null} = user;
  let attributes = {};
  let response = null;
  let responseCode;

  const account = await getUserAccount(user);
  if (!account || !account.response) {
    return attributes;
  }

  // set user account informations
  response = account.response;
  responseCode = account.responseCode;

  // Check if we should create an account (If is NOT in CULR)
  if (shouldCreateAccount(agencyId, user, response)) {
    // It should not have been possible for a user to have authenticated through borchk,
    // and not to exist in CULR. Therefore a warning is logged.
    log.warn('Borck user not in culr', {userId, agencyId});

    try {
      const createUserResponse = await createUser(user, agencyId);
      const newAccount = await getUserAccount(user);

      // set user account informations
      response = newAccount.response;
      responseCode = newAccount.responseCode;
    } catch (e) {
      log.error('Could not create User in CULR', {userId, agencyId, e});
    }
  }

  if (responseCode === 'OK200') {
    attributes.accounts = response.result.Account;
    const {
      municipalityNumber,
      municipalityAgencyId
    } = await getMunicipalityInformation(response.result, user);
    attributes.municipalityNumber = municipalityNumber;
    attributes.municipalityAgencyId = municipalityAgencyId;
    attributes.culrId = response.result.Guid || null;
    return attributes;
  }

  // Quick fix for Býarbókasavnið. TODO: clean up.
  const {
    municipalityNumber,
    municipalityAgencyId
  } = await getMunicipalityInformation({}, user);
  attributes.municipalityNumber = municipalityNumber;
  attributes.municipalityAgencyId = municipalityAgencyId;

  return attributes;
}

/**
 * Fetches the users account
 *
 * Always tries to fetch account by a global-id - then with local-id as fallback
 *
 * @param {Object} user
 * @returns {Object} response (account) + responseCode (error|success)
 */

async function getUserAccount(user) {
  const {userId, agency: agencyId = null} = user;

  let response = null;
  let responseCode = null;

  try {
    response = await culr.getAccountsByGlobalId({
      userIdValue: userId,
      agencyId
    });
    responseCode = response && response.result.responseStatus.responseCode;

    if (responseCode === 'ACCOUNT_DOES_NOT_EXIST' && agencyId) {
      // Not found as global id, lets try as local id
      response = await culr.getAccountsByLocalId({
        userIdValue: userId,
        agencyId
      });
      responseCode = response && response.result.responseStatus.responseCode;
    }

    return {response, responseCode};
  } catch (e) {
    log.error('Request to CULR failed', {error: e.message, stack: e.stack});
    return null;
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
export async function getMunicipalityId(user) {
  const result = await validateUserInLibrary(
    CONFIG.borchk.serviceRequesterInMunicipality,
    user
  );
  if (!result.error && user.agency.startsWith('7')) {
    return user.agency.slice(1, 4);
  }
  return null;
}

/**
 * Find municipality Number and Municipality Agency
 *
 * We can only get municipality if user has logged in through library in municipality.
 *
 * @param {{MunicipalityNo: String|undefined}} culrResponse
 * @param {{agency: String}} user
 * @returns {{municipalityAgencyId, String|null, municipalityNumber:String|null}}
 */
export async function getMunicipalityInformation(culrResponse, user) {
  let response = {};

  try {
    // check if user lives in municipality
    if (user.agency && user.userId && user.pincode) {
      const borchkMunicipalityNo = await getMunicipalityId(user);
      // If user lives in municipality - Use borchk informations
      if (borchkMunicipalityNo) {
        response.municipalityAgencyId = user.agency;
        response.municipalityNumber = borchkMunicipalityNo;
        return response;
      }
    }

    if (
      culrResponse.MunicipalityNo &&
      culrResponse.MunicipalityNo.length === 3
    ) {
      response.municipalityNumber = culrResponse.MunicipalityNo;
      if (user.agency) {
        response.municipalityAgencyId = user.agency.startsWith('7')
          ? `7${culrResponse.MunicipalityNo}00`
          : user.agency;
      } else {
        response.municipalityAgencyId = `7${culrResponse.MunicipalityNo}00`;
      }
    } else if (user.agency) {
      response.municipalityAgencyId = user.agency;
      if (user.agency.startsWith('7')) {
        response.municipalityNumber = user.agency.slice(1, 4);
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
  const response = await culr.createAccount({
    userIdType,
    userIdValue,
    agencyId,
    municipalityNo: await getMunicipalityId(user)
  });

  const responseCode = response && response.return.responseStatus.responseCode;

  return responseCode === 'OK200';
}

/**
 * Util function for checking if library is registrered on Culr profile
 *
 * @param {String} library
 * @param {Object} user
 * @param {Object} response
 * @returns
 */
export function shouldCreateAccount(library, user, response) {
  if (!library || !municipalityName[library]) {
    return false;
  }

  const currentProvider =
    user.identityProviders && user.identityProviders.slice(-1)[0];
  if (currentProvider !== 'borchk') {
    return false;
  }

  const responseCode = response && response.result.responseStatus.responseCode;
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
 * @param {String} CPR
 * @returns {string} agency
 */

export async function getAgencyByCpr(cpr) {
  if (!cpr) {
    return null;
  }

  // Fetching user
  const response = await culr.getAccountsByGlobalId({
    userIdValue: cpr
  });

  const result = response && response.result;

  if (result.responseStatus.responseCode === 'OK200') {
    // If user found but has no agency relations
    if (!result.Account || result.Account.length === 0) {
      return null;
    }

    // Returns the 'best-match' agency from the sorted agency list
    const match = sortAgencies(result.Account, result.MunicipalityNo)[0];
    if (match && match.provider) {
      return match.provider;
    }
    return null;
  }

  return null;
}

/**
 * Function that sorts agencies (From culr response) in a priority order
 *
 * agency with provider including the MunicipalityNo is 1. sort priority
 * agency with type of CPR is. 2. sort priority
 *
 * @param {Array} agencies
 * @param {String} municipalityNumber
 * @returns {Array}
 */

export function sortAgencies(agencies, municipalityNo) {
  return sortBy(agencies, [
    o => (o.provider.includes(municipalityNo) ? -1 : +1),
    'userIdType'
  ]);
}
