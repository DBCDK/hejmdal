/**
 * @file
 *
 * Functions Write, Read and Delete entries in a key-value storage
 *
 */

import {log} from '../utils/logging.util';

export class KeyValueStorage {
  /**
   * Constructor should have the DB connection as parameter
   */
  constructor(db_connecton = {}) {
    this.someDb = db_connecton;
    this.someKey = 0;
  }

  /**
   * Store an object in a DB and return the key to it
   *
   * @param {object} attributes
   * @returns {string} key to stored object
   */
  writeObject(attributes) {
    let objectKey = false;
    try {
      // TODO: write attributes in ticket to some storage
      objectKey = this.someKey++;
      this.someDb[objectKey] = attributes;
    }
    catch (e) {
      log.error('Write object', e.message);
    }

    return objectKey;
  }

  /**
   * Store an object in a DB by the given key
   *
   * @param {string} key
   * @param {object} value
   * @returns {boolean} Returns true if succesfully stored otherwise false
   */
  writeObjectWithKey(key, value) {
    let success = false;

    try {
      // TODO: write attributes in ticket to some storage
      this.someDb[key] = value;
      success = true;
    }
    catch (e) {
      log.error('Write object with key', e.message);
    }

    return success;
  }

  /**
   * Read an on object from storage
   *
   * @param {string} objectKey
   * @returns {mixed}
   */
  readObject(objectKey) {
    let object = false;
    try {
      // TODO: read ticket from some storage
      if (this.someDb[objectKey]) {
        object = this.someDb[objectKey];
      }
    }
    catch (e) {
      log.error('Fetch object', e.message);
    }
    return object;
  }

  /**
   * Delete an object in storage
   *
   * @param {string} objectKey
   * @returns {boolean}
   */
  deleteObject(objectKey) {
    try {
      // TODO: delete ticket in some storage
      delete this.someDb[objectKey];
    }
    catch (e) {
      log.error('Delete object', e.message);
    }
    return true;
  }
}
