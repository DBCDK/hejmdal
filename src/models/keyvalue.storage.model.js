/**
 * @file
 *
 * Functions Write, Read and Delete entries in a key-value storage
 *
 */

import {log} from '../utils/logging';

export class KeyValueStorage {
  /**
   * Constructor should have the DB connection as parameter
   */
  constructor() {
    this.someDb = {};
  }

  /**
   * Store an object in a DB and return the key to it
   *
   * @param {object} attributes
   * @returns {string} key to stored object
   */
  writeObject(object) {
    let objectKey = false;
    try {
      // TODO: write attributes in ticket to some storage
      objectKey = Object.keys(this.someDb).length;
      this.someDb[objectKey] = object;
    }
    catch (e) {
      log.error('Write object', e.message);
    }
    return objectKey;
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
