/**
 * @file
 * Implements the ticket model
 */

import {Model} from 'objection';

export default class Ticket extends Model {
  static tableName = 'ticket';

  static jsonSchema = {
    properties: {
      tid: {type: 'string', minLength: 1},
      ticket: {type: 'object'}
    }
  };
}
