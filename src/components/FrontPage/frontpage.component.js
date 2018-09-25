/**
 * @file
 * Functionality to rendering of frontpage
 */

import {getText} from '../../utils/text.util';

export async function renderFrontPage(req, res, next) {
  await res.render('Frontpage', {
    help: getText(['deleteConsents'])
  });
  await next();
}
