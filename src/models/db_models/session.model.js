/**
 * @file
 * Implements the session model
 */

import {Model} from 'objection';

export default class Session extends Model {
  static tableName = 'session';

  static jsonSchema = {
    properties: {
      sid: {type: 'string', minLength: 64, maxLength: 256},
      session: {type: 'object'}
    }
  };
}
