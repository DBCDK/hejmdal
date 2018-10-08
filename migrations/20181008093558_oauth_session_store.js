
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('sessions', (table) => {
    table.string('sid', 256).unique().notNullable().index();
    table.dateTime('expired');
    table.jsonb('sess');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('sessions');

};
