/**
 * @file
 * Error objects for smaug requests
 *
 * @see https://github.com/DBCDK/serviceprovider/blob/master/src/smaug/errors.js
 */

export class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TokenError';
    this.message = message || 'Generic TokenError';
    this.stack = (new Error()).stack;
    this.httpStatusCode = 400;
    this.httpError = 'generic_token_error';
  }
}
