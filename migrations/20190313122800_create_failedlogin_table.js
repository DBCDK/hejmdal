/**
 * @file
 * Add user table for storing failed login information
 */

exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('failedlogin', table => {
    table.string('id', 64);
    table.jsonb('failInfo');
    table.dateTime('created').defaultTo(knex.fn.now());
    table.unique(['id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('failedlogin');
};
