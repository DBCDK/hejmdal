/**
 * @file
 *
 */

import {CONFIG} from '../../utils/config.util';
import {promiseRequest} from '../../utils/request.util';
import {log} from '../../utils/logging.util';
import _ from 'lodash';

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
    const isValid = !_.get(parsedBody, 'forsRightsResponse.error', false);

    return isValid;
  } catch (error) {
    log.error(error);
    throw error;
  }
}
