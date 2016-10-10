/**
 * @file
 * Class that extends the koa-seesion2 Store object and serves as the binding layer to the session storage
 */

import {Store} from 'koa-session2';
import {PersistenSessionStorage} from '../../models/session.persistent.storage.model';
import {MemorySessionStorage} from '../../models/session.memory.storage.model';

export default class SessionStore extends Store {
  /**
   * Initises the SessionStore and the underlying storage component.
   * If the memory paramter is used one should be aware that sharring of sessions across instances of the application
   * is not possible. The feature is intended for testing only.
   *
   * @param {boolean} memory if set to true a Map will be used for storing sessions
   */
  constructor(memory = false) {
    super();
    this.Store = memory ? new MemorySessionStorage() : new PersistenSessionStorage();
  }

  /**
   * Retreives the session object based on the given sid.
   *
   * @param {string} sid
   * @return {undefined|object}
   */
  async get(sid) {
    return await this.Store.get(sid);
  }

  /**
   * Generates a new sid if needed, stores the given session object keyed by the sid and returns the sid.
   *
   * @param {object} session
   * @param {object} opts
   * @return {string}
   */
  async set(session, opts) {
    if (!opts.sid) {
      opts.sid = this.getID(128);
    }

    await this.Store.set(opts.sid, session);

    return opts.sid;
  }

  /**
   * Destroys the session keyed by the given sid
   *
   * @param {string} sid
   * @return {boolean} true if session was successfully deleted otherwise false i.e. if the session was not found.
   */
  async destroy(sid) {
    return await this.Store.deleteSession(sid);
  }
}
