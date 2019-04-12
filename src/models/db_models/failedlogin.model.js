/**
 * @file
 * Implements the failed login model
 */

import {Model} from 'objection';

export default class FailedLogin extends Model {
  static tableName = 'failedlogin';

  static jsonSchema = {
    properties: {
      id: {type: 'string', minLength: 0, maxLength: 64},
      created: {type: 'dateTime'},
      failInfo: {type: 'object'}
    }
  };
}
