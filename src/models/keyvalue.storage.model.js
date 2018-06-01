/**
 * @file
 *
 * Functions Write, Read and Delete entries in a key-value storage
 *
 */

import {log} from '../utils/logging.util';
import {encrypt, decrypt} from '../utils/hash.utils';

export default class KeyValueStorage {
  /**
   * Constructor should have the CRUD store class as parameter
   */
  constructor(store) {
    this.store = store;
  }

  /**
   * Store an object in a DB and return the key to it
   *
   * @param {object} object
   * @returns {string} key to stored object
   */
  async insertNext(object) {
    let objectKey = false;
    try {
      objectKey = await this.store.insertNext(encrypt(object));
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
  async insert(key, object) {
    let success = false;

    try {
      success = await this.store.insert(key, encrypt(object));
    }
    catch (e) {
      log.error('Write object with key', {error: e.message, stack: e.stack});
    }

    return success;
  }

  /**
   * Read an on object from store
   *
   * @param {string} objectKey
   * @param {string} extra
   * @returns {boolean}
   */
  async read(objectKey, extra) {
    let object = false;
    try {
      object = await this.store.read(objectKey, extra);
      if (object) {
        object = decrypt(object);
      }
    }
    catch (e) {
      log.error('Read object', {error: e.message, stack: e.stack});
    }
    return object;
  }

  /**
   * Find objects from store where key begins with given prefix
   *
   * @param {string} objectKeyPrefix
   * @param {string} extra
   * @returns {boolean}
   */
  async find(objectKeyPrefix, extra) {
    let objects = false;
    try {
      objects = await this.store.find(objectKeyPrefix, extra);
      objects = objects.map(o => ({key: o.key, value: decrypt(o.value)}));
    }
    catch (e) {
      log.error('Find objects', {error: e.message, stack: e.stack});
    }
    return objects;
  }

  /**
   * Delete an object in store
   *
   * @param {string} objectKey
   * @returns {boolean}
   */
  async delete(objectKey) {
    let success = false;
    try {
      success = await this.store.delete(objectKey);
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
  async garbageCollect(probability, expires) {
    if (!Math.floor(Math.random() * probability)) {
      try {
        return await this.store.garbageCollect(expires);
      }
      catch (e) {
        log.error('Garbage Collect', {error: e.message, stack: e.stack});
      }
    }
    return true;
  }
}
