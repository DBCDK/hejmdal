/**
 * @file
 * Storage model for simple memory storage of objects - CRUD (and createNext and upsert) functions
 *
 */

import {CONFIG} from '../utils/config.util';
import {registerStore} from '../utils/test.util';

export default class MemoryStorage {

  constructor() {
    this.sequence = 1;
    this.storage = {};

    if (CONFIG.app.env === 'test') {
      registerStore(this);
    }
  }

  /**
   * Store an entry if its not already there
   *
   * @param key
   * @param obj
   * @returns {*}
   */
  async insert(key, obj) {
    if (!this.storage[key]) {
      return (this.storage[key] = obj);
    }
    return false;
  }

  /**
   * Store an object in next entry and return the key
   *
   * @param obj
   * @returns {number}
   */
  async insertNext(obj) {
    this.storage[this.sequence] = obj;
    return this.sequence++;
  }

  /**
   * Return an entry given by a key
   *
   * @param key
   * @returns {*}
   */
  async read(key) {
    if (this.storage[key]) {
      return this.storage[key];
    }
    return false;
  }

  /**
   * Find objects from store where key begins with given prefix
   *
   * @param {string} objectKeyPrefix
   * @returns {boolean}
   */
  async find(objectKeyPrefix) {
    const entries = [];
    for (var key in this.storage) {
      if (this.storage.hasOwnProperty(key)) {  // eslint-disable-line no-prototype-builtins
        const value = this.storage[key];
        entries.push([key, value]);
      }
    }
    const objects = entries
      .filter(entry => entry[0] && entry[0].startsWith && entry[0].startsWith(objectKeyPrefix))
      .map(entry => {
        return {
          key: entry[0],
          value: entry[1]
        };
      });
    return objects.length > 0 ? objects : false;
  }

  /**
   * Update an entry if it exist
   *
   * @param key
   * @param obj
   * @returns {*}
   */
  async update(key, obj) {
    if (this.storage[key]) {
      return (this.storage[key] = obj);
    }
    return false;
  }

  /**
   * Store an entry whether its there or not
   *
   * @param key
   * @param obj
   * @returns {*}
   */
  async upsert(key, obj) {
    return (this.storage[key] = obj);
  }

  /**
   * Delete an entry if it exist
   *
   * @param key
   * @returns {boolean}
   */
  async delete(key) {
    if (this.storage[key]) {
      return delete this.storage[key];
    }
    return false;
  }

  wipeout() {
    if (CONFIG.app.env === 'test') {
      this.storage = {};
      this.sequence = 1;
    }
  }

  /**
   * Garbage Collection
   *
   * @param expires
   * @returns {boolean}
   */
  async garbageCollect(expires) {    // eslint-disable-line no-unused-vars
    return true;
  }
}
