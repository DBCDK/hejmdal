/**
 * Change table failedlogin to include a primary key on column id
 */

exports.up = function(knex) {
  return knex.schema.alterTable('failedlogin', (table) => {
      table.primary('id');
      table.dropUnique('id');
  });
};

exports.down = function(knex) {
    return null;
};
