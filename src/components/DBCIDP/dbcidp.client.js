/**
 * @file
 * Client for communicating with the idp service
 */

import {CONFIG} from '../../utils/config.util';
import getMockClient from './mock/dbcidp.client.mock';
import {promiseRequest} from '../../utils/request.util';
import {log} from '../../utils/logging.util';

/**
 * Function to retrieve agencyId rights from forsrights service
 *
 * @param agencyId agencyId this request if made for
 * @param {object} params
 * @return {object}
 *
 * Params example:
 *   {
 *     url: CONFIG.dbcidp.dbcidpUri,
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json'
 *     },
 *     body: {token: accessToken, userIdAut: 'netpunkt'}
 *   }
 */
export async function fetchDbcidpRights(agencyId, params) {
  try {
    let resp;
    if (CONFIG.mock_externals.dbcidp) {
      resp = getMockClient(agencyId);
    } else {
      resp = await promiseRequest('post', params);
    }
    if (resp.statusCode !== 200) {
      return {};
    }
    const response = JSON.parse(resp.body);
    if (response.authenticated === false) {
      return {};
    }
    return {agencyId, rights: response.rights};
  } catch (error) {
    log.error(`Error retrieving agency DBCIDP rights for ${agencyId}`, {
      error: error.message,
      stack: error.stack
    });
    return {};
  }
}

/**
 * Function to retrieve agency rights from DBCIDP service
 *
 * @param {string} accessToken
 * @param {object} user information
 * @return {array}
 */
export async function getDbcidpAgencyRights(accessToken, user) {
  const dbcidpUri = CONFIG.dbcidp.dbcidpUri + '/authorize';
  const body = {token: accessToken, userIdAut: user.userId};
  const requestParams = {
    url: dbcidpUri,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  const result = await fetchDbcidpRights(user.agency, requestParams);
  return result.length === 0 ? {} : [result];
}

/**
 * Function to retrieve agency rights from DBCIDP service and return result as FORS structure to help older clients
 *
 * @param {string} accessToken
 * @param {object} user information
 * @return {array}
 */
export async function getDbcidpAgencyRightsAsFors(accessToken, user) {
  const dbcidp = await getDbcidpAgencyRights(accessToken, user);
  log.info('map DBCIDP to FORS');
  const result = [];
  dbcidp.forEach((agency) => {
    if (agency.agencyId) {
      const fors = {agencyId: agency.agencyId, rights: {}};
      if (agency.rights && Array.isArray(agency.rights)) {
        agency.rights.forEach((product) => {
          fors.rights[product.productName.toLowerCase()] = ['500', '501'];
        });
      }
      result.push(fors);
    }
  });

  return result;
}

/**
 * Function to authenticate a user (netpunkt-triple) against DBCIDP
 *
 * @param userIdAut userIdAut, f.ex. 'netpunkt'
 * @param groupIdAut groupIdAut, f.ex. '716700'
 * @param passwordAut passwordAut, password for login
 * @returns {Promise<boolean|*>}
 */
export async function validateIdpUser(userIdAut, groupIdAut, passwordAut) {
  if (CONFIG.mock_externals.dbcidp && (userIdAut === 'valid-user') && groupIdAut && passwordAut) {
    return true;
  }
  const idpUri = CONFIG.dbcidp.dbcidpUri + '/authenticate';
  const body = {userIdAut, passwordAut, agencyId: groupIdAut};

  const params = {
    url: idpUri,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  try {
    const response = await promiseRequest('post', params);
    const parsedBody = JSON.parse(response.body);
    return parsedBody.authenticated;
  } catch (error) {
    log.error('Error validating DBCIDP access profile', {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
}
