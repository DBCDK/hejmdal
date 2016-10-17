/**
 * @file
 * Utils for generating and verifying hash keys
 *
 */
import crypto from 'crypto';
import {CONFIG} from './config.util'

/**
 * Return true for scalar variables
 *
 * @param mixed
 * @returns {boolean}
 */
function is_scalar(mixed) {
  return (/string|number/).test(typeof mixed);
}

/**
 * Create a hash
 *
 * @param toHash
 * @returns {string}
 */
export function createHash(toHash, hashSecret = 'shared') {
  const secret = CONFIG.hash[hashSecret] ? CONFIG.hash[hashSecret] : CONFIG.hash.shared;
  if (is_scalar(toHash)) {
    return crypto
      .createHmac('sha256', secret)
      .update(toHash.toString())
      .digest('hex');
  }
  throw new TypeError('Wrong type for createHash function');
}

/**
 * Verify if a hash is generated from an identical string
 *
 * @param hashedString
 * @param validateString
 * @returns {boolean}
 */
export function validateHash(hashedString, validateString) {
  return (hashedString === createHash(validateString));
}
