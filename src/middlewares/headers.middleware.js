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
    Pragma: 'no-cache',
    Expires: '0'
  });
  next();
}
