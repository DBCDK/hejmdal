/**
 * @file
 * Middleware for handling errors
 */

import {log} from '../utils/logging.util';

/**
 * Middleware that renders an errorpage.
 *
 * @param {object} ctx
 * @param {function} next
 */
export default async function errorMiddleware(ctx, res, next) {
  try {
    await next();

    if (ctx.status === 404) {
      ctx.throw(404);
    } else if (ctx.status === 403) {
      ctx.throw(403);
    }
  } catch (err) {
    ctx.status = err.status || 500;
    const state = ctx.getState();
    const link = state &&
      state.smaugToken && {
        href: `/login?token=${state.smaugToken}`,
        value: 'Prøv igen'
      };
    let error = 'Der er sket en fejl. Prøv at logge ind igen';
    if (ctx.status === 403) {
      error =
        'Du har ikke adgang til denne side. Dette kan skyldes, at der benyttes et ugyldigt token';
    } else if (ctx.status === 404) {
      error = 'Siden, du forsøger at tilgå, findes ikke';
    } else {
      log.error('An error has happened', {
        error: err.message,
        stack: err.stack,
        url: ctx.url
      });
    }

    ctx.render('Error', {error, link});
  }
}
