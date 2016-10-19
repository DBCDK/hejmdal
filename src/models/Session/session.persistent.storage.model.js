/**
 * @file
 * Storage model for persistent storage of sessions
 */

import Session from '../db_models/session.model';
import {log} from '../../utils/logging.util';

export default class PersistenSessionStorage {

  read(sid) {
    return Session.query().select('session').where('sid', sid)
      .then((result) => {
        return result.length ? result[0].session : null;
      })
      .catch((error) => {
        log.error('Failed to get session', {error: error.message});
        return null;
      });
  }

  insert(sid, session) {
    return Session.query().insert({sid: sid, session: session})
      .catch((error) => {
        log.error('Failed to set session', {error: error.message});
      });
  }

  delete(sid) {
    return Session.query().delete().where('sid', sid)
      .then(() => {
        return true;
      })
      .catch((error) => {
        log.error('Failed to delete session', {error: error.message});
        return false;
      });
  }

  garbageCollect(expires) {      // eslint-disable-line no-unused-vars
    return true;
    /* Session has no date column as now
    const gcTime = new Date(new Date().getTime() - (expires * 1000));
    Session.query().select('*').where('created', '<', gcTime)
      .then((result) => {
        result.forEach((session) => {
          this.delete(session.sid);
          log.info('Garbage collect session id: ' + session.sid + ' created: ' + ticket.created);
        });
      })
      .catch((error) => {
        log.error('Failed to garbage collect tickets', {error: error.message});
        return false;
      });

     return true;
     */
  }

  update(sid, session) {   // eslint-disable-line no-unused-vars
    throw new Error('Cannot use update in session');
  }

  upsert(sid, session) {   // eslint-disable-line no-unused-vars
    throw new Error('Cannot use upsert in session');
  }

  insertNext(session) {   // eslint-disable-line no-unused-vars
    throw new Error('Cannot use insertNext in session');
  }

}
