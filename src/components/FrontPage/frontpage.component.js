/**
 * @file
 * Functionality to rendering of frontpage
 */

import {getText} from '../../utils/text.util';

export async function renderFrontPage(ctx, next) {
  await ctx.render('Frontpage', {
    help: getText(['deleteConsents'])
  });
  await next();
}
