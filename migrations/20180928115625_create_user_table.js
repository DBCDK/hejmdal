/**
 * @file
 * Add user table for storing userinfomation from identityproviders.
 */

exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('user', (table) => {
    table.increments('id').primary();
    table.dateTime('created').defaultTo(knex.fn.now());
    table.string('userId', 256).notNullable();
    table.jsonb('user');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user');
};
