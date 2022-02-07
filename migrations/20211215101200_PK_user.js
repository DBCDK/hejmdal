/**
 * Change table user to include an index on userId and make it not null.
 */

exports.up = function(knex) {
  let alter = knex.schema.alterTable('user', (table) => {
      table.string('userId').notNullable().index('user_userId_idx').alter();
  });


  return knex.raw('select t.relname as table_name, i.relname as index_name, a.attname as column_name from pg_class t, pg_class i, pg_index ix, pg_attribute a where t.oid = ix.indrelid and i.oid = ix.indexrelid and a.attrelid = t.oid and a.attnum = ANY(ix.indkey) and t.relkind = \'r\' and t.relname = \'user\' and a.attname = \'userId\'')
  .then((resp) => {
      if (resp.rowCount !== 0) {
        console.error("User table already contains an index on userId ");
        return null;
      } else {
        console.error("Adding index on userId to user table");
        return knex.schema.alterTable('user', (table) => {
                table.string('userId').notNullable().index('user_userId_idx').alter();
                  });
      }
  },
  () => {
      console.error("Error when trying to query for index");
      return null;
  }
  )
  .catch(function(error) {
    console.error("ERROR trying to alter user table");
    console.error(error);
    return null;
  });
};

exports.down = function(knex) {
    return null;
};
