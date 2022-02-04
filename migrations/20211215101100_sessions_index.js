/**
 * Change table sessions. Drop extra indexes in expired (May be recreated later)
 */

exports.up = function(knex) {
  return knex.schema
    .raw('drop index if exists sessions_expired_idx')
    .raw('drop index if exists sessions_expired_index');
};

exports.down = function(knex) {
    return null;
};
