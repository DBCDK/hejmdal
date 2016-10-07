/**
 * @file
 * Storage model for persistent storage of sessions
 */

import Session from './db_models/session.model';

export class PersistenSessionStorage {

  async get(sid) {
    return Session.query().select('session').where('sid', sid).then((result) => {
      return result.length ? result[0].session : null;
    });
  }

  async set(sid, session) {
    return Session.query().insert({sid: sid, session: session}).then((result) => {
      console.log('result', result);
      return result;
    });
  }

  async deleteSession(sid) {
    return await Session.query().delete().where('sid', sid);

  }
}
