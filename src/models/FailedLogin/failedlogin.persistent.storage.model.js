/**
 * @file
 * Storage model for persistent storage of failedlogins
 */

import FailedLogin from '../db_models/failedlogin.model';
import {log} from '../../utils/logging.util';

export default class PersistentFailedLoginStorage {

  read(id) {
    return FailedLogin.query().select('failInfo').where('id', id)
      .then((result) => {
        return result.length ? result[0].failInfo : null;
      })
      .catch((error) => {
        log.error('Failed to get failedlogin', {error: error.message});
        return null;
      });
  }

  insert(id, failInfo) {
    return FailedLogin.query().insert({id: id, failInfo: failInfo})
      .catch((error) => {
        log.error('Failed to insert failedlogin', {error: error.message});
      });
  }

  update(id, failInfo) {
    return FailedLogin.query().where({id: id}).update({failInfo: failInfo})
      .catch((error) => {
        log.error('Failed to update failedlogin', {error: error.message});
      });
  }

  delete(id) {
    return FailedLogin.query().delete().where('id', id)
      .then(() => {
        return true;
      })
      .catch((error) => {
        log.error('Failed to delete failedlogin', {error: error.message});
        return false;
      });
  }

  garbageCollect(expires) {
    return FailedLogin.query().select('*').where('created', '<', expires)
      .then((result) => {
        result.forEach((login) => {
          this.delete(login.id);
        });
        return true;
      })
      .catch((error) => {
        log.error('Failed to garbage collect failedLogin', {error: error.message});
        return false;
      });
  }

  static insertNext(id) {   // eslint-disable-line no-unused-vars
    throw new Error('Cannot use insertNext in failedlogin');
  }

  static upsert(id) {   // eslint-disable-line no-unused-vars
    throw new Error('Cannot use upsert in failedlogin');
  }

  static find(id) {   // eslint-disable-line no-unused-vars
    throw new Error('Cannot use find in failedlogin');
  }

}
