/**
* @file
* Storage model for non-persistent (memory) storage of sessions
*/

import {KeyValueStorage} from './keyvalue.storage.model';

export class SessionMemoryStorage extends KeyValueStorage {
  constructor(){
    const db_connection = {};
    super(db_connection);
  }

  async get(sid) {
    return await this.readObject(sid);
  }

  async set(sid, session) {
    return await this.writeObjectWithKey(sid, session);
  }

  async deleteSession(sid) {
    return await this.deleteObject(sid);
  }
}
