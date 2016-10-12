/**
 * @file
 * Session relevant middleware
 */

import {CONFIG} from '../utils/config.util';

/**
 * Checks if session is set and refreshes time of expiry.
 * If sesseion is unset an empty object will be set.
 *
 * @param {object} ctx
 * @param {function} next
 */
export async function SessionMiddleware(ctx, next) {
  if (Object.keys(ctx.session).length === 0) {
    ctx.session = {};
  }

  ctx.session.expires = new Date(Date.now() + (CONFIG.session.life_time)).toISOString();

  await next();
}
