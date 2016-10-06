/**
 * @file
 * Class that extends the koa-seesion2 Store object and serves as the binding layer to the session storage
 */

import {Store} from 'koa-session2';
import {PersistenSessionStorage} from '../../models/session.persistent.storage.model';
import {MemorySessionStorage} from '../../models/session.memory.storage.model';
import {log} from '../../utils/logging.util';

export default class SessionStore extends Store {
  /**
   * Initises the SessionStore and the underlying Storage component.
   * If the memory paramter is used one should be aware that sharring of sessions across instances of the application
   * is not pissoble. The feaure is intended for testing only.
   *
   * @param {boolean} memory if set to true a Map will be used for storring sessions
   */
  constructor(memory = false) {
    super();
    // TODO request StoreController to connect to -- should tests run in a memorystore?
    this.Store = memory ? new MemorySessionStorage() : new PersistenSessionStorage();
  }

  /**
   * Retreives the session object based on the given sid.
   *
   * @param {string} sid
   * @return {undefined|object}
   */
  async get(sid) {
    // TODO request session from StoreController
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

    try {
      // TODO set session on StoreController
      await this.Store.set(opts.sid, session);
    }
    catch (e) {
      log.error('Faield to set session', e.message);
    }

    return opts.sid;
  }

  /**
   * Destroys the session keyed by the given sid
   *
   * @param {string} sid
   * @return {boolean} true if session was successfully deleted otherwise false i.e. if the session was not found.
   */
  async destroy(sid) {
    // TODO request session delted on StoreController
    return await this.Store.deleteSession(sid);
  }
}
