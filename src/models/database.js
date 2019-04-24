/**
 * @file
 * Configure and and update database
 */

import Knex from 'knex';
import {Model} from 'objection';
import {log} from '../utils/logging.util';
import {CONFIG} from '../utils/config.util';

/**
 * Initialises database and bind knex instanse to models.
 *
 * Also runs latest migrations.
 *
 * @export
 * @returns {knex: KnexInstance}
 */
export default function initialize() {
  // Initialize knex.
  const knex = Knex(CONFIG.postgres);

  knex.migrate
    .latest()
    .then(() => {
      log.debug('Database is now at latest version.');
    })
    .catch(e => {
      log.error('Could not update database to latest version', {
        error: e.message,
        stack: e.stack
      });
    });

  // Bind all Models to a knex instance. If you only have one database in
  // your server this is all you have to do. For multi database systems, see
  // the Model.bindKnex method.
  Model.knex(knex);

  return {knex};
}
