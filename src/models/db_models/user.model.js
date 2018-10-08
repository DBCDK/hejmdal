/**
 * @file
 * Implements the ticket model
 */

import {Model} from 'objection';

export default class User extends Model {
  static tableName = 'user';

  static jsonSchema = {
    properties: {
      user: {type: 'object'},
      userId: {type: 'string'}
    }
  };
}
