/**
 * @file
 * Middleware for setting values in the responseheader
 */

import {VERSION} from '../utils/version.util';

/**
 * Sets the version of the API in the header on theresponses
 *
 * @param {object} ctx
 * @param {function} next
 */
export async function setHeaders(ctx, res, next) {
  await next();
  res.set({
    'X-API-Version': VERSION,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  });
}
