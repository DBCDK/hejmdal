/**
 * @file
 * Storage model for persistent storage of tickets. CRUD functions
 */

import cas from '../db_models/cas.model';
import {log} from '../../utils/logging.util';

export default class PersistentCasStorage {
  read(code) {
    return cas
      .query()
      .select('options')
      .where('code', code)
      .then(result => {
        return result[0] ? result[0].options : null;
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
    return cas
      .query()
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
    return cas
      .query()
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
    return cas
      .query()
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
