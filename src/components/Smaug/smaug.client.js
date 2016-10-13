import {CONFIG} from '../../utils/config.util';
import {TokenError} from './smaug.errors';
import request from 'request';

/**
 * Retreives context based on given token
 *
 * @param {string} token
 * @return {Promise}
 */
export function getAttributes(token) {
  return new Promise((resolve, reject) => {
    request.get({
      uri: CONFIG.SMAUG + '/configuration',
      qs: {token: token}
    }, (err, response, body) => {
      switch (response.statusCode) {
        case 200:
          return resolve(JSON.parse(body));
        case 404:
          return reject(new TokenError());
        default:
          return reject(err);
      }
    });
  });
}
