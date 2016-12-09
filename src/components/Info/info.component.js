/**
 * @file
 */

import {getText} from '../../utils/text.util';

/**
 * Renders text for info operation
 *
 * @param ctx
 * @param next
 */
export async function showInfo(ctx, next) {
  ctx.render('Info', {
    info: true,
    help: getText(['cookies'])
  });
  await next();
}
