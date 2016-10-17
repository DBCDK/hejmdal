/**
 * @file
 * Implements the consent model
 */

import {Model} from 'objection';

export default class Consent extends Model {
  static tableName = 'consent';

  static jsonSchema = {
    properties: {
      consentid: {type: 'string', minLength: 1, maxLength: 256},
      consent: {type: 'object'}
    }
  };
}
