/**
 * @file
 *
 */
import {CONFIG} from '../../utils/config.util';
import {BorchkError} from './borchk.errors';
import getMockClient from './mock/borchk.client.mock';
import {promiseRequest} from '../../utils/request.util';

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

  // for test and development
  if (CONFIG.mock_externals.borchk) {
    response = getMockClient(agency);
  } else {
    response = await promiseRequest('get', {
      uri: CONFIG.borchk.uri,
      qs: {
        serviceRequester: serviceRequester,
        libraryCode: 'DK-' + agency,
        userId: userId,
        userPincode: pinCode
      }
    });
  }

  if (response.statusCode === 200) {
    return JSON.parse(response.body);
  }

  throw new BorchkError(response.statusMessage);
}
