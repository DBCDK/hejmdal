/**
 * @file
 * Utils for generating and verifying hash keys
 *
 */
import crypto from 'crypto';

const secret = '$2a$10$CxBm8c7NDbvi24vGV7pwOe';  //  TODO: should be fetched from some setting/env var (issue #83)

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
export function createHash(toHash) {
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
