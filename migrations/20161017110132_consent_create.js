/**
 * Creates the consent table
 *
 * @param knex
 * @return {*}
 */
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('consent', (table) => {
    table.increments('id').primary();
    table.string('consentid', 256).unique().notNullable();
    table.jsonb('consent');
    table.dateTime('created').defaultTo(knex.fn.now());
  });
};

/**
 * Drops the consent table
 *
 * @param knex
 * @return {*}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('consent');
};
