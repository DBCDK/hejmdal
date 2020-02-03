/**
 * @file
 * Client for communicating with the forsrights service
 */

import {CONFIG} from '../../utils/config.util';
import {promiseRequest} from '../../utils/request.util';
import {log} from '../../utils/logging.util';
import _ from 'lodash';

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
