/**
 * Change table sessions. Drop index on sid so we can make it primary later.
 * Also change expired and sess to not null. Add index on expired.
 */

exports.up = function(knex) {
  return knex.schema.alterTable('sessions', (table) => {
      table.dropIndex('sid', 'sessions_sid_index');
      table.dateTime('expired').notNullable().index().alter();
      table.json('sess').notNullable().alter();
  });
};

exports.down = function(knex) {
    return null;
};
