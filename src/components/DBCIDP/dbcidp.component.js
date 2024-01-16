/**
 * @file
 * DBCIDP component handles interaction between the containing application and DBCIDP
 */

import * as dbcidp from './dbcidp.client';
import {log} from '../../utils/logging.util';
import {identityProviderValidationFailed} from '../Identityprovider/identityprovider.component';

/** Return true if a given agency har license for a given product
 *
 * @param agencyId
 * @param productName
 * @returns {Promise<boolean>}
 */
export async function checkAgencyForProduct(agencyId, productName) {
  let found = false;
  const result = await dbcidp.fetchSubscribersByProduct(productName);
  if (result && result.organisations && result.organisations.length) {
    result.organisations.forEach((lib) => {
      if (lib.agencyId === agencyId) {
        found = true;
      }
    });
  }
  return found;
}

/**
 * Function to retrieve rights and attributes from dbcidp for a given user
 *
 * @param {string} accessToken
 * @param {object} user information
 * @returns {Promise<{}>}
 */
export async function getDbcidpAuthorize(accessToken, user) {
  return await dbcidp.fetchDbcidpAuthorize(accessToken, user);
}

/**
 * Function to retrieve agency rights from DBCIDP service
 *
 * @param {string} accessToken
 * @param {object} user information
 * @return {array}
 */
export async function getDbcidpAgencyRights(accessToken, user) {
  const dbcidpAuth = await dbcidp.fetchDbcidpAuthorize(accessToken, user);
  return dbcidpAuth.length === 0
    ? {}
    : [{agencyId: user.agency, rights: dbcidpAuth.rights}];
}

/**
 * Function to retrieve agency rights from DBCIDP service and return result as FORS structure to help older clients
 *
 * @param {string} accessToken
 * @param {object} user information
 * @return {array}
 */
export async function getDbcidpAgencyRightsAsFors(accessToken, user) {
  const agencyRights = await getDbcidpAgencyRights(accessToken, user);
  log.info('map DBCIDP to FORS');
  const result = [];
  agencyRights.forEach((agency) => {
    if (agency.agencyId) {
      const fors = {agencyId: agency.agencyId, rights: {}};
      if (agency.rights && Array.isArray(agency.rights)) {
        agency.rights.forEach((right) => {
          fors.rights[right.productName.toLowerCase()] = ['500', '501'];
        });
      }
      result.push(fors);
    }
  });

  return result;
}


/**
 * Parses the callback parameters for netpunkt and dbcidp. Parameters from form comes as post
 *
 * @param req
 * @param res
 * @param idpName
 * @returns {*}
 */
export async function dbcidpCallback(req, res, idpName) {
  const formData = req.fakeNetpunktPost || req.body;
  const trimmedGroupId = formData.loginBibDkGroupId.toLowerCase().replace('dk-', '');
  const validated = {error: true, message: 'unknown_error'};

  const userId = formData.loginBibDkUserId;
  const groupId = trimmedGroupId;
  const password = formData.loginBibDkPassword;

  if (userId && groupId && password) {
    const isValid = await dbcidp.validateIdpUser(userId, groupId, password);

    if (isValid) {
      const user = {
        userId: userId,
        userType: idpName,
        agency: groupId,
        password: password,
        userValidated: true
      };

      // Set user session
      return req.setUser(user);
    }
    validated.message = 'fimis';
  } else {
    validated.message = 'fieldValidationErrors';
  }
  identityProviderValidationFailed(req, res, validated, groupId);
  return false;
}
