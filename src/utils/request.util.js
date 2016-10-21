import request from 'request';

/**
 * Wrap requests in a promise.
 *
 * @param {String} method
 * @param {Object} props
 * @returns {Promise}
 */
export function promiseRequest(method, props) {
  return new Promise((resolve, reject) => {
    request[method](props, (err, response) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(response);
      }
    });
  });
}
