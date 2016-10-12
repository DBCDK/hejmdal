/**
 * @file
 * Implements the ticket model
 */

import {Model} from 'objection';

export default class Ticket extends Model {
  static tableName = 'ticket';

  static jsonSchema = {
    properties: {
      ticket: {type: 'object'}
    }
  };
}
