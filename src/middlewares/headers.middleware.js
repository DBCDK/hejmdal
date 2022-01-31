/**
 * @file
 * Middleware for setting values in the responseheader
 */

import {VERSION} from '../utils/version.util';

/**
 * Sets the version of the API in the header on theresponses
 *
 * @param {object} req
 * @param {function} next
 */
export function setHeaders(req, res, next) {
  res.set({
    'X-API-Version': VERSION,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Security-Policy':
      'default-src \'self\' \'unsafe-inline\';' +
      'script-src \'self\' \'unsafe-inline\' http://responder.wt-safetag.com/;' +
      'img-src \'self\' \'unsafe-inline\' data:;',
    Pragma: 'no-cache',
    Expires: '0'
  });
  next();
}
