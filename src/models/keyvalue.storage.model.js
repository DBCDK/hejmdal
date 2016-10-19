/**
 * @file
 *
 * Functions Write, Read and Delete entries in a key-value storage
 *
 */

import {log} from '../utils/logging.util';

export default class KeyValueStorage {
  /**
   * Constructor should have the CRUD storage class as parameter
   */
  constructor(storage = () => {
  }) {
    this.storage = storage;
  }

  /**
   * Store an object in a DB and return the key to it
   *
   * @param {object} object
   * @returns {string} key to stored object
   */
  insertNext(object) {
    let objectKey = false;
    try {
      objectKey = this.storage.insertNext(object);
    }
    catch (e) {
      log.error('Write object', {error: e.message, stack: e.stack});
    }

    return objectKey;
  }

  /**
   * Store an object in a DB by the given key
   *
   * @param {string} key
   * @param {object} object
   * @returns {boolean} Returns true if succesfully stored otherwise false
   */
  insert(key, object) {
    let success = false;

    try {
      success = this.storage.insert(key, object);
    }
    catch (e) {
      log.error('Write object with key', {error: e.message, stack: e.stack});
    }

    return success;
  }

  /**
   * Read an on object from storage
   *
   * @param {string} objectKey
   * @returns {boolean}
   */
  read(objectKey) {
    let object = false;
    try {
      object = this.storage.read(objectKey);
    }
    catch (e) {
      log.error('Read object', {error: e.message, stack: e.stack});
    }
    return object;
  }

  /**
   * Delete an object in storage
   *
   * @param {string} objectKey
   * @returns {boolean}
   */
  delete(objectKey) {
    let success = false;
    try {
      success = this.storage.delete(objectKey);
    }
    catch (e) {
      log.error('Delete object', {error: e.message, stack: e.stack});
    }
    return success;
  }

  /**
   * Garbage Collect
   *
   * @param probability
   * @param expires - seconds
   * @returns {*}
   */
  garbageCollect(probability, expires) {
    if (!Math.floor(Math.random() * probability)) {
      try {
        return this.storage.garbageCollect(expires);
      }
      catch (e) {
        log.error('Delete object', {error: e.message, stack: e.stack});
      }
    }
    return true;
  }
}
