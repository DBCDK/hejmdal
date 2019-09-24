/**
 * @file
 * CULR compoennt handles all interaction bewteen the containing application and CULR
 */

import * as culr from './culr.client';
import {log} from '../../utils/logging.util';
import {validateUserInLibrary} from '../Borchk/borchk.component';
import {CONFIG} from '../../utils/config.util';

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

  try {
    response = await culr.getAccountsByGlobalId({userIdValue: userId});
    responseCode = response && response.result.responseStatus.responseCode;
    if (responseCode === 'ACCOUNT_DOES_NOT_EXIST' && agencyId) {
      // Not found as global id, lets try as local id
      response = await culr.getAccountsByLocalId({
        userIdValue: userId,
        agencyId: agencyId
      });
      responseCode = response && response.result.responseStatus.responseCode;
    }
  } catch (e) {
    log.error('Request to CULR failed', {error: e.message, stack: e.stack});
    return attributes;
  }

  try {
    // If possible user should be created. This requires following, CPR, AgencyID
    // and optionally MuncipalityID:
    if (shouldCreateAccount(agencyId, user, response)) {
      // It should not have been possible for a user to have authenticated through borchk,
      // and not to exist in CULR. Therefore a warning is logged.
      log.warn('Borck user not in culr', {userId, agencyId});

      const createUserResponse = await createUser(user, agencyId);
      if (createUserResponse) {
        response = await culr.getAccountsByGlobalId({userIdValue: userId});
        responseCode = response && response.result.responseStatus.responseCode;
      }
    }
  } catch (e) {
    log.error('Could not create User in CULR', {userId, agencyId, e});
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
    // Quick fix for Býarbókasavnið. TODO: clean up.
  } else {
    const {
      municipalityNumber,
      municipalityAgencyId
    } = await getMunicipalityInformation({}, user);
    attributes.municipalityNumber = municipalityNumber;
    attributes.municipalityAgencyId = municipalityAgencyId;
  }

  return attributes;
}

/**
 * Get municipality for user.
 *
 * We can only get municipality if user has logged in through library in municipality.
 *
 * @param {*} user
 * @returns {string|null}
 */
async function getMunicipalityId(user) {
  const result = await validateUserInLibrary(
    CONFIG.borchk.serviceRequesterInMunicipality,
    user
  );
  if (!result.error) {
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
  if (culrResponse.MunicipalityNo && culrResponse.MunicipalityNo.length === 3) {
    response = {
      municipalityNumber: culrResponse.MunicipalityNo,
      municipalityAgencyId: `7${culrResponse.MunicipalityNo}00`
    };
  } else if (user.agency) {
    const result = await validateUserInLibrary(
      CONFIG.borchk.serviceRequesterInMunicipality,
      user
    );
    if (!result.error) {
      response.municipalityAgencyId = user.agency;
      if (user.agency.startsWith('7')) {
        response.municipalityNumber = user.agency.slice(1, 4);
      }
    }
  }

  return response;
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
  if (!user.cpr || !agencyId) {
    return false;
  }
  // Check if user has logged in on municipality
  // Create user on CULR.
  const response = await culr.createAccount({
    userIdValue: user.cpr,
    agencyId: agencyId,
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
function shouldCreateAccount(library, user, response) {
  if (!library || !library.indexOf('7') === 0) {
    return false;
  }

  const currentProvider =
    user.identityProviders && user.identityProviders.slice(-1)[0];
  if (!currentProvider === 'borchk') {
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
