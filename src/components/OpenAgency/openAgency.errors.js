/**
 * @file
 * Error objects for openAgency requests
 *
 */

export class OpenAgencyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OpenAgencyError';
    this.message = message || 'Generic OpenAgencyError';
    this.stack = (new Error()).stack;
    this.httpStatusCode = 400;
    this.httpError = 'generic_openagency_error';
  }
}
