/**
 * Change table sessions drop unique index since there is already a primary index
 */

exports.up = function(knex) {
  return knex.schema.alterTable('sessions', (table) => {
      table.dropUnique('sid');
  });
};

exports.down = function(knex) {
    return null;
};
