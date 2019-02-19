exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('cas', table => {
    table.increments('id').primary();
    table
      .string('code', 256)
      .unique()
      .notNullable()
      .index();
    table.dateTime('created').defaultTo(knex.fn.now());
    table.jsonb('options');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cas');
};
