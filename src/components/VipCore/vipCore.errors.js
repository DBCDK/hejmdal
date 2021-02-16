/**
 * @file
 * Error objects for vipCore requests
 *
 */

export class VipCoreError extends Error {
  constructor(message) {
    super(message);
    this.name = 'VipCoreError';
    this.message = message || 'Generic VipCoreError';
    this.stack = (new Error()).stack;
    this.httpStatusCode = 400;
    this.httpError = 'generic_vipcore_error';
  }
}
