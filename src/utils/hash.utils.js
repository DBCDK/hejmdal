/**
 * @file
 * Utils for generating and verifying hash keys
 *
 */
import crypto from 'crypto';

const secret = '$2a$10$CxBm8c7NDbvi24vGV7pwOe';  //  TODO: should be fetched from some setting

/**
 * Create a hash
 *
 * @param toHash
 * @returns {string}
 */
export function createHash(toHash) {
  return crypto
    .createHmac('sha256', secret)
    .update(toHash)
    .digest('hex');
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
