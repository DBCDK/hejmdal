/**
 * @file
 * Config mapper that maps environment variables to the exportet CONFIG object.
 * A validateConfig method that validates the values found in the CONFIG object and throws an Error upon invalid values.
 */


export const CONFIG = {
  app: {
    env: process.env.NODE_ENV,
    port: Number(process.env.PORT)
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
    pretty: process.env.PRETTY_LOG === '1'
  },
  session: {
    life_time: Number(process.env.SESSION_LIFE_TIME)
  },
  hash: {
    shared: process.env.HASH_SHARED
  },
  garbageCollect: {
    ticket: {
      divisor: Number(process.env.GC_TICKET_DIVISOR) || 1000,
      seconds: Number(process.env.GC_TICKET_SECONDS) || 3600   // 60 * 60
    },
    session: {
      divisor: Number(process.env.GC_SESSION_DIVISOR) || 1000,
      seconds: Number(process.env.GC_SESSION_SECONDS) || 2678400  // 31 * 24 * 60 * 60
    }
  },
  borchk: {
    uri: process.env.BORCHK_URI
  },
  smaug: {
    uri: process.env.SMAUG_URI
  },
  mock_externals: {
    ticket: process.env.MOCK_TICKET_STORAGE || false,
    consent: process.env.MOCK_CONSENT_STORAGE || false,
    smaug: process.env.MOCK_SMAUG !== '0',
    borchk: process.env.MOCK_BORCHK !== '0'
  }
};

/**
 * Recursive functon that validates that all params in the above CONFIG object is set.
 * Number are validated to be non-NaN numbers.
 *
 * @param {Object} config
 */
export function validateConfig(config = CONFIG) {
  for (let key in config) {
    if (typeof config[key] === 'object') {
      validateConfig(config[key]);
    }
    else {
      if (config[key] === undefined) { // eslint-disable-line no-undefined
        throw Error(`${key} was not specified in config. See https://github.com/DBCDK/hejmdal#environment-variabler`);
      }
      if (typeof config[key] === 'number' && Number.isNaN(config[key])) {
        throw Error(`${key}: expected NaN to be a number. See https://github.com/DBCDK/hejmdal#environment-variabler`);
      }
    }
  }
}
