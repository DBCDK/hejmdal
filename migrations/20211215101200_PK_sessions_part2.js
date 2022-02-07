/**
 * Change table sessions to include a primary key on column sid.
 */

exports.up = function(knex) {
  let alter = knex.schema.alterTable('sessions', (table) => {
      table.primary('sid');
  });


  return knex.raw('SELECT a.* FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) WHERE i.indrelid = \'sessions\'::regclass AND i.indisprimary')
  .then((resp) => {
      if (resp.rowCount !== 0) {
          console.error("sessions table already contains a primary key");
          return null;
      } else {
          console.error("Adding Primary key to sessions table");
          return alter;
      }
  },
  () => {
      console.error("Error when trying to query for Primary Index");
      return null;
  }
  )
  .catch(function(error) {
    console.error("ERROR trying to alter sessions table");
    console.error(error);
    return null;
  });
};

exports.down = function(knex) {
    return null;
};
