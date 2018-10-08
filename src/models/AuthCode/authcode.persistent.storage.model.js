/**
 * @file
 * Storage model for persistent storage of tickets. CRUD functions
 */

import AuthCode from '../db_models/authorizationCode.model';
import {log} from '../../utils/logging.util';

export default class PersistentAuthCodeStorage {

  read(cid) {
    return AuthCode.query().select('code').where('cid', cid)
      .then((result) => {
        return result[0] ? result[0].code : null;
      })
      .catch((error) => {
        log.error('Failed to get authorization_code', {error: error.message});
        return null;
      });
  }

  insertNext() {
    throw new Error('Cannot use insertNext in authCode');
  }

  delete(cid) {
    return AuthCode.query().delete().where('cid', cid)
      .then(() => {
        return true;
      })
      .catch((error) => {
        log.error('Failed to delete authCode', {error: error.message});
        return false;
      });
  }

  garbageCollect(expires) {
    const gcTime = new Date(new Date().getTime() - (expires * 1000));
    return AuthCode.query().select('*').where('created', '<', gcTime)
      .then((result) => {
        result.forEach((code) => {
          this.delete(code.cid);
          log.info('Garbage collect ticket', {id: code.cid, created: code.created});
        });
        return true;
      })
      .catch((error) => {
        log.error('Failed to garbage collect tickets', {error: error.message});
        return false;
      });
  }

  insert(cid, code) {   // eslint-disable-line no-unused-vars
    return AuthCode.query().insert({cid, code})
      .then((result) => {
        return result.id ? result.id : null;
      })
      .catch((error) => {
        log.error('Failed to set code', {error: error.message, code});
        return null;
      });
  }

  update(tid, ticket) {   // eslint-disable-line no-unused-vars
    throw new Error('Cannot use update in ticket');
  }

  upsert(tid, ticket) {   // eslint-disable-line no-unused-vars
    throw new Error('Cannot use upsert in ticket');
  }

  static find(tid) {   // eslint-disable-line no-unused-vars
    throw new Error('Cannot use find in ticket');
  }
}
