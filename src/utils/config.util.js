import {flatMapDeep} from 'lodash';

export const CONFIG = {
  app: {
    env: process.env.NODE_ENV,
    port: Number(process.env.PORT),
  },
  postgres: {
    client: 'postgresql',
    connection: {
      host: process.env.HEJMDAL_DB_HOST,
      database: process.env.HEJMDAL_DB_NAME,
      user: process.env.HEJMDAL_DB_USER,
      password: process.env.HEJMDAL_DB_USER_PASSWORD,
      charset: 'utf8'
    },
    pool: {
      min: Number(process.env.HEJMDAL_DB_CONNECTIONS_POOL_MIN),
      max: Number(process.env.HEJMDAL_DB_CONNECTIONS_POOL_MAX)
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  log: {
    level: process.env.LOG_LEVEL,
    pretty: process.env.PRETTY_LOG === "1",
  },
  session: {
    life_time: Number(process.env.SESSION_LIFE_TIME)
  }
};

/**
 * Recursive functon that validates that all params in the above CONFIG object is set.
 * Number are validated to be non-NaN numbers.
 * TODO mmj testing
 *
 * @param {Object} config
 */
export function validateConfig(config = CONFIG) {
  for(let key in config) {
    if(typeof config[key] === 'object'){
      validateConfig(config[key]);
    } else {
      if(config[key] === undefined ) {
        throw Error(`${key} was not specified in config. See https://github.com/DBCDK/hejmdal#environment-variabler`);
      }
      if(typeof config[key] === 'number' && Number.isNaN(config[key])) {
        throw Error(`${key}: expected NaN to be a number. See https://github.com/DBCDK/hejmdal#environment-variabler`);
      }
    }
  }
}
