/**
 * @file
 *
 */
import {CONFIG} from '../../utils/config.util';
import {BorchkError} from './borchk.errors';
import {promiseRequest} from '../../utils/request.util';
import {log} from '../../utils/logging.util';

/**
 * Retreives if a user is known on a given library
 *
 * @param agency
 * @param userId
 * @param pinCode
 * @param serviceName
 * @return {Object}
 * @throws {Error|TokenError}
 */
/**
 *
 */
export async function getClient(agency, userId, pinCode, serviceRequester) {
  let response;

  const requestParams = {
    uri: CONFIG.borchk.uri,
    qs: {
      serviceRequester: serviceRequester,
      libraryCode: 'DK-' + agency,
      userId: userId,
      userPincode: pinCode
    }
  };
  response = await promiseRequest('get', requestParams);
  log.debug('Borchk request', {requestParams, body: response.body});

  if (response.statusCode === 200) {
    return JSON.parse(response.body);
  }

  throw new BorchkError(response.statusMessage);
}
