/**
 * @file
 * Implements the ticket model
 */

import {Model} from 'objection';

export default class Cas extends Model {
  static tableName = 'cas';
  static jsonSchema = {
    properties: {
      ticket: {type: 'string'},
      options: {type: 'object'}
    }
  };
}
