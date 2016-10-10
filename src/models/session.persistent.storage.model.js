/**
 * @file
 * Storage model for persistent storage of sessions
 */

import Session from './db_models/session.model';
import {log} from '../utils/logging.util';

export class PersistenSessionStorage {

  get(sid) {
    return Session.query().select('session').where('sid', sid)
      .then((result) => {
        return result.length ? result[0].session : null;
      })
      .catch((error) => {
        log.error('Failed to get session', {error: error.message});
        return null;
      });
  }

  set(sid, session) {
    return Session.query().insert({sid: sid, session: session})
      .catch((error) => {
        log.error('Failed to set session', {error: error.message});
      });
  }

  deleteSession(sid) {
    return Session.query().delete().where('sid', sid)
      .then(() => {
        return true;
      })
      .catch((error) => {
        log.error('Failed to delete session', {error: error.message});
        return false;
      });
  }
}
