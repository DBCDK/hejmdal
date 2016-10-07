/**
 * Creates the session table
 * @param knex
 * @param Promise
 * @return {*}
 */
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('session', (table) => {
    table.increments('id').primary();
    table.string('sid', 256).unique().notNullable();
    table.jsonb('session');
  });
};

/**
 * Drops the session table
 * @param knex
 * @param Promise
 * @return {*}
 */
exports.down = function(knex, Promise) {
  return knex.schema.dropTable('session')
};
