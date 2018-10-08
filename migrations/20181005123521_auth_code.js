
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('authcode', (table) => {
    table.increments('id').primary();
    table.string('cid', 256).unique().notNullable().index();
    table.dateTime('created').defaultTo(knex.fn.now());
    table.jsonb('code');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('authcode');
};
