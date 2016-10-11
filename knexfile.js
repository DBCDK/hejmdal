// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: process.env.HEJMDAL_DB_HOST,
      database: process.env.HEJMDAL_DB_NAME,
      user: process.env.HEJMDAL_DB_USER,
      password: process.env.HEJMDAL_DB_USER_PASSWORD,
      charset: 'utf8'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: process.env.HEJMDAL_DB_HOST,
      database: process.env.HEJMDAL_DB_NAME,
      user: process.env.HEJMDAL_DB_USER,
      password: process.env.HEJMDAL_DB_USER_PASSWORD,
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.HEJMDAL_DB_HOST,
      database: process.env.HEJMDAL_DB_NAME,
      user: process.env.HEJMDAL_DB_USER,
      password: process.env.HEJMDAL_DB_USER_PASSWORD,
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
