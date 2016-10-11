/**
 * @file
 * Storage model for simple memory storage of objects - CRUD (and createNext and upsert) functions
 *
 */

export default class MemoryStorage {

  constructor() {
    this.sequence = 1;
    this.storage = {};
  }

  /**
   * Store an entry if its not already there
   *
   * @param key
   * @param obj
   * @returns {*}
   */
  insert(key, obj) {
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
  insertNext(obj) {
    this.storage[this.sequence] = obj;
    return this.sequence++;
  }

  /**
   * Return an entry given by a key
   *
   * @param key
   * @returns {*}
   */
  read(key) {
    if (this.storage[key]) {
      return this.storage[key];
    }
    return false;
  }

  /**
   * Update an entry if it exist
   *
   * @param key
   * @param obj
   * @returns {*}
   */
  update(key, obj) {
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
  upsert(key, obj) {
    return (this.storage[key] = obj);
  }

  /**
   * Delete an entry if it exist
   *
   * @param key
   * @returns {boolean}
   */
  delete(key) {
    if (this.storage[key]) {
      return delete this.storage[key];
    }
    return false;
  }
}
