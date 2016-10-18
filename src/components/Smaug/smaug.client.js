import {CONFIG} from '../../utils/config.util';
import {TokenError} from './smaug.errors';
import request from 'request';

/**
 * Retreives context based on given token
 *
 * @param {String} token
 * @return {Object}
 * @throws {Error|TokenError}
 */
export async function getClient(token) {
  const {response, body} = await promiseRequest('get', {
    uri: CONFIG.smaug.uri + '/configuration',
    qs: {token: token}
  });

  if (response.statusCode === 200) {
    return JSON.parse(body);
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
