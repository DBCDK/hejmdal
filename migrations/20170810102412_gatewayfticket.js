/**
 * Creates the gatewayfticket table
 * @param knex
 * @return {*}
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('gatewayftickets', (table) => {
    table.increments('id').primary();
    table.string('ticketsecret', 256).notNullable();
    table.jsonb('ticket');
    table.dateTime('timestamp').defaultTo(knex.fn.now());
  });
};

/**
 * Drops the session table
 * @param knex
 * @return {*}
 */
exports.down = function (knex) {
  return knex.schema.dropTable('gatewayftickets');
};
