/**
 * @file
 * Middleware for handling errors
 */

import {log} from '../utils/logging.util';

/**
 * Middleware that renders an errorpage.
 *
 * @param {object} req
 * @param {function} next
 */
export default async function errorMiddleware(err, req, res, next) {
  log.error('An error has happened', {
    error: err.message,
    stack: err.stack,
    url: req.url
  });

  res.render('Error', {error: 'Der er sket en fejl. Prøv at logge ind igen'});
}
