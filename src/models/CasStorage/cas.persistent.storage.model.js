/**
 * @file
 * Storage model for persistent storage of tickets. CRUD functions
 */

import AuthCode from '../db_models/authorizationCode.model';
import {log} from '../../utils/logging.util';

export default class PersistentCasStorage {
  read(code) {
    return AuthCode.query()
      .select('options')
      .where('code', code)
      .then(result => {
        return result[0] ? result[0].code : null;
      })
      .catch(error => {
        log.error('Failed to get CAS options with authorization_code', {
          error: error.message
        });
        return null;
      });
  }

  insertNext() {
    throw new Error('Cannot use insertNext in Cas');
  }

  delete(code) {
    return AuthCode.query()
      .delete()
      .where('code', code)
      .then(() => {
        return true;
      })
      .catch(error => {
        log.error('Failed to delete CAS options for authCode', {
          error: error.message
        });
        return false;
      });
  }

  garbageCollect(expires) {
    return AuthCode.query()
      .select('*')
      .where('created', '<', expires)
      .then(result => {
        result.forEach(entry => {
          this.delete(entry.code);
          log.info('Garbage collect CAS options', {
            id: entry.code,
            created: entry.created
          });
        });
        return true;
      })
      .catch(error => {
        log.error('Failed to garbage collect CAS options', {
          error: error.message
        });
        return false;
      });
  }

  insert(code, options) {
    return AuthCode.query()
      .insert({code, options})
      .then(result => {
        return result.id ? result.id : null;
      })
      .catch(error => {
        log.error('Failed to set code', {error: error.message, options});
        return null;
      });
  }

  update() {
    throw new Error('Cannot use update in CAS options');
  }

  upsert() {
    throw new Error('Cannot use upsert in CAS options');
  }

  static find() {
    throw new Error('Cannot use find in CAS options');
  }
}
