/**
 * Creates the session table
 * @param knex
 * @return {*}
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('session', (table) => {
    table.increments('id').primary();
    table.string('sid', 256).unique().notNullable().index();
    table.dateTime('created').defaultTo(knex.fn.now());
    table.jsonb('session');
  });
};

/**
 * Drops the session table
 * @param knex
 * @return {*}
 */
exports.down = function (knex) {
  return knex.schema.dropTable('session');
};
