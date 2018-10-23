/**
 * @file
 */

import {getText} from '../../utils/text.util';

/**
 * Renders text for info operation
 *
 * @param req
 * @param res
 * @param next
 */
export async function showInfo(req, res, next) {
  const text = getText([req.params.infoId]);
  if (!text) {
    next();
  } else {
    res.render('Info', {
      info: true,
      textObj: text
    });
  }
}
