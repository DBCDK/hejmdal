import {CONFIG} from '../../utils/config.util';
import {TokenError} from './smaug.errors';
import mockClient from './mock/smaug.client.mock';
import request from 'request';

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

/**
 * Wrap requests in a promise.
 *
 * @param {String} method
 * @param {Object} props
 * @returns {Promise}
 */
function promiseRequest(method, props) {
  return new Promise((resolve, reject) => {
    request[method](props, (err, response, body) => {
      if (err) {
        reject(err);
      }
      else {
        resolve({response, body});
      }
    });
  });
}
