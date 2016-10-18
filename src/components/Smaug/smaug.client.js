import {CONFIG} from '../../utils/config.util';
import {TokenError} from './smaug.errors';
import mockClient from './mock/smaug.client.mock';
import {promiseRequest} from '../../utils/request.util';
/**
 * Retreives context based on given token
 *
 * @param {String} token
 * @return {Object}
 * @throws {Error|TokenError}
 */
export async function getClient(token) {
  let response;

  // for test and development
  if (CONFIG.mock_externals.smaug) {
    response = mockClient(token);
  }
  else {
    response = await promiseRequest('get', {
      uri: CONFIG.smaug.uri + '/configuration',
      qs: {token: token}
    });
  }
  if (response.statusCode === 200) {
    return JSON.parse(response.body);
  }

  throw new TokenError(response.message);
}
