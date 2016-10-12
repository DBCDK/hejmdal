/**
 * @file
 * Storage model for non-persistent (memory) storage of sessions
 *
 *
 * TODO Obsolete - to delete when appropriate
 */

import KeyValueStorage from './keyvalue.storage.model';

export class MemorySessionStorage extends KeyValueStorage {
  constructor() {
    const db_connection = {};
    super(db_connection);
  }

  async get(sid) {
    return await this.read(sid);
  }

  async set(sid, session) {
    return await this.insert(sid, session);
  }

  async deleteSession(sid) {
    return await this.deleteObject(sid);
  }
}
