/**
 * Creates the ticket table
 * @param knex
 * @return {*}
 */
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('ticket', (table) => {
    table.increments('id').primary();
    table.string('tid', 256).unique().notNullable();
    table.dateTime('created').defaultTo(knex.fn.now());
    table.jsonb('ticket');
  });
};

/**
 * Drops the session table
 * @param knex
 * @return {*}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('ticket');
};
