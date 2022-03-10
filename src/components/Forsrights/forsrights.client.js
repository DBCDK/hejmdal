/**
 * @file
 * Client for communicating with the forsrights service
 */

import {CONFIG} from '../../utils/config.util';
import {promiseRequest} from '../../utils/request.util';
import {log} from '../../utils/logging.util';
import _ from 'lodash';

/**
 * Function to prettify the forsrights response
 *
 * @param {array} forsrights response
 * @return {array} (prettified)
 */
function filterForsrightsResponse(forsrights) {
  // Map every agency in response
  return forsrights.map(a => {
    const a_rights = {};
    const agencyId = a.agencyId;
    // Map every service in agency
    if (Array.isArray(a.rights)) {
      a.rights.forEach(s => {
        const name = s.name.$;
        // Map every rights in service + sort ascending
        const s_rights = s.right.map(r => r.$).sort((an, bn) => an - bn);
        // Set new servicename in object
        a_rights[name] = s_rights;
      });
    }
    return {agencyId, rights: a_rights};
  });
}

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
 * @param {array} agencies
 * @return {array}
 */

export async function getAgencyRights(accessToken, agencies) {
  const requestUrl = CONFIG.forsrights.forsrightsUri;

  const promises = agencies.map(agency => {
    const requestParams = {
      uri: requestUrl,
      qs: {
        action: 'forsRights',
        outputType: 'json',
        accessToken,
        agency
      }
    };

    return fetchRights(requestParams);
  });

  const result = await Promise.all(promises);

  // Filter the forsrights response before return
  const filteredResult = filterForsrightsResponse(result);

  return filteredResult;
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
  let requestUrl = CONFIG.forsrights.forsrightsUri;

  const requestParams = {
    uri: requestUrl,
    qs: {
      action: 'forsRights',
      userIdAut,
      groupIdAut,
      passwordAut,
      outputType: 'json'
    }
  };

  try {
    const response = await promiseRequest('get', requestParams);
    const parsedBody = JSON.parse(response.body);

    /**
     * Validation returns true if no 'error' object is found in the response.body
     * - No further validation is done
     */
    const isValid = !_.get(parsedBody, 'forsRightsResponse.error', false);
    return isValid;
  } catch (error) {
    log.error('Error validating netpunkt-triple-user', {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
}
