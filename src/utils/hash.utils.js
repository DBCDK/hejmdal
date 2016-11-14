/**
 * @file
 * Utils for generating and verifying hash keys
 *
 */
import crypto from 'crypto';
import {CONFIG} from './config.util';

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
 * @param hashSecret
 * @returns {*}
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
 * MD5 hashes the given string and returns the result
 *
 * @param {string} str
 */
export function md5(str){
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
}

/**
 * Verify if a hash is generated from an identical string
 *
 * @param hashedString
 * @param validateString
 * @param hashSecret
 * @returns {boolean}
 */
export function validateHash(hashedString, validateString, hashSecret = 'shared') {
  return (hashedString === createHash(validateString, hashSecret));
}
