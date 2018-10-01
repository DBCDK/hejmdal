/**
 * @file
 * Storage model for persistent storage of users. CRUD functions
 */

import User from '../db_models/user.model';
import {log} from '../../utils/logging.util';

export default class PersistentUserStorage {

  read(userId) {
    return User.query().select('user').where('userId', userId)
      .then((result) => {
        return result[0] ? result[0].user : null;
      })
      .catch((error) => {
        log.error('Failed to get user', {error: error.message});
        return null;
      });
  }

  insert(user) {
    return User.query().insert({userId: user.userId, user})
      .then((result) => {
        return result.id ? result.id : null;
      })
      .catch((error) => {
        log.error('Failed to set user', {error: error.message}, user);
        return null;
      });
  }

  delete(userId) {
    return User.query().delete().where('userId', userId)
      .then(() => {
        return true;
      })
      .catch((error) => {
        log.error('Failed to delete ticket', {error: error.message});
        return false;
      });
  }


  async update(userId, user) {   // eslint-disable-line no-unused-vars
    const userInDb = await this.read(userId);
    if (!userInDb) {
      return this.insert(user);
    }
    return User.query().update({user}).where('userId', userId)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        log.error('Failed to update user', {error: error.message});
        return false;
      });
  }
}
