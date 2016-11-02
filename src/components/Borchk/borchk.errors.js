/**
 * @file
 * Error objects for borchk requests
 *
 */

export class BorchkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BorchkError';
    this.message = message || 'Generic BorchkError';
    this.stack = (new Error()).stack;
    this.httpStatusCode = 400;
    this.httpError = 'generic_borchk_error';
  }
}
