/**
 * @file
 * Class that extends the koa-seesion2 Store object and serves as the binding layer to the session storage
 */

import {Store} from 'koa-session2';
import {log} from '../../utils/logging.util';

export default class SessionStore extends Store {
  constructor() {
    super();
    this.Store = new Map();
    // TODO request StoreController to connect to -- should tests run in a memorystore?
  }

  async get(sid) {
    // TODO request session from StoreController
    return await this.Store.get(sid);
  }

  async set(session, opts) {
    if (!opts.sid) {
      opts.sid = this.getID(32);
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

  async destroy(sid) {
    // TODO request session delted on StoreController
    return await this.Store.delete(sid);
  }
}
