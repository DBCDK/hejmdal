/**
 * @file
 * Client for communicating with the forsrights service
 */

import {promiseRequest} from '../../utils/request.util';
import {getDbcidpAgencyRights, validateIdpUser} from '../DBCIDP/dbcidp.client';
import {log} from '../../utils/logging.util';
import _ from 'lodash';

/**
 * Function to retrieve agency rights from forsrights service
 *
 * @param {object} params
 * @return {object}
 *
 * Params example:
 *
 *   {
 *     uri: requestUrl,
 *     qs: {
 *     action: 'forsRights',
 *       outputType: 'json',
 *       accessToken,
 *       agency
 *     }
 *   }
 *
 */

export async function fetchRights(params) {
  const agencyId = params.qs.agency;

  try {
    const resp = await promiseRequest('get', params);
    const parsedBody = JSON.parse(resp.body);

    const rights = _.get(parsedBody, 'forsRightsResponse.ressource', []);

    return {agencyId, rights};
  } catch (error) {
    log.error(`Error retrieving agency forsrights for ${agencyId}`, {
      error: error.message,
      stack: error.stack
    });
    return {agencyId, rights: []};
  }
}

/**
 * Function to retrieve (MULTIPLE) agency rights from forsrights service
 *
 * @param {string} accessToken
 * @param {object} user information
 * @return {array}
 */

export async function getAgencyRights(accessToken, user) {
  const dbcidp = await getDbcidpAgencyRights(accessToken, user);

  const fakeFors = [];
  dbcidp.forEach((agency) => {
    const fors = { agencyId: agency.agencyId, rights: {} };
    agency.rights.forEach((product) => {
      fors.rights[product.productName.toLowerCase()] = ['500', '501'];
    })
    fakeFors.push(fors);
  });

  return fakeFors;
}

/**
 * Function to validate if a 'netpunkt-triple-login' is valid
 * The validation is done against the forsrights service.
 *
 * @param userIdAut
 * @param groupIdAut
 * @param passwordAut
 * @return {boolean}
 */

export async function validateNetpunktUser(userIdAut, groupIdAut, passwordAut) {
  return await validateIdpUser(userIdAut, groupIdAut, passwordAut);
}
