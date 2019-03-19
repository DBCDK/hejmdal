/**
 * @file
 * Utils for generating and verifying hash keys
 *
 */
import crypto from 'crypto';
import {CONFIG} from './config.util';
import {log} from './logging.util';

const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Return true for scalar variables
 *
 * @param mixed
 * @returns {boolean}
 */
function is_scalar(mixed) {
  return /string|number/.test(typeof mixed);
}

/**
 * Create a hash
 *
 * @param toHash
 * @param hashSecret
 * @returns {*}
 */
export function createHash(toHash, hashSecret = 'shared') {
  const secret = CONFIG.hash[hashSecret]
    ? CONFIG.hash[hashSecret]
    : CONFIG.hash.shared;
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
export function md5(str) {
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
export function validateHash(
  hashedString,
  validateString,
  hashSecret = 'shared'
) {
  return hashedString === createHash(validateString, hashSecret);
}

/**
 * Encrypt object
 *
 * @param data
 * @returns {Object}
 */
export function encrypt(data) {
  const text = JSON.stringify(data);
  const iv = crypto.randomBytes(IV_LENGTH);

  const textBuffer = new Buffer(text, 'utf8');
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    new Buffer(CONFIG.hash.aes256Secret),
    new Buffer(iv)
  );
  cipher.write(textBuffer);
  cipher.end();

  return {
    hex: cipher.read().toString('hex'),
    iv
  };
}

/**
 * Decrypt object
 *
 * @param obj an object returned by the encrypt function
 * @returns {Object}
 */
export function decrypt(obj) {
  try {
    const hexBuffer = new Buffer(obj.hex, 'hex');
    const iv = obj.iv;
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      new Buffer(CONFIG.hash.aes256Secret),
      new Buffer(iv)
    );
    decipher.write(hexBuffer);
    decipher.end();
    const data = decipher.read().toString('utf8');
    return JSON.parse(data);
  } catch (e) {
    log.error('Failed to decrypt', {
      decrypt: obj,
      error: e.message,
      stack: e.stack
    });
  }
}
