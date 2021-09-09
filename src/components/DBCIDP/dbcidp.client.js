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
export async function fetchIdpRights(agencyId, params) {
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
    log.error(`Error retrieving agency idp rights for ${agencyId}`, {
      error: error.message,
      stack: error.stack
    });
    return {};
  }
}

/**
 * Function to retrieve (MULTIPLE) agency rights from forsrights service
 *
 * @param {string} accessToken
 * @param {array} agencies
 * @return {array}
 */
export async function getIdpAgencyRights(accessToken, agencies) {
  const idpUri = CONFIG.dbcidp.dbcidpUri + "/authorize";
  const body = {token: accessToken, userIdAut: 'netpunkt'}; // TODO: userIdAut should configurable
  const promises = agencies.map(agency => {
    const requestParams = {
      url: idpUri,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    return fetchIdpRights(agency, requestParams);
  });
  const result = await Promise.all(promises);
  return result.length === 0 ? {} : result;
}
