/**
 * @file
 * Implements the ticket model
 */

import {Model} from 'objection';

export default class AuthCode extends Model {
  static tableName = 'authcode';
  static jsonSchema = {
    properties: {
      cid: {type: 'string'},
      code: {type: 'object'}
    }
  };
}
