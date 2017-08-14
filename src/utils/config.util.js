/**
 * @file
 * Config mapper that maps environment variables to the exportet CONFIG object.
 * A validateConfig method that validates the values found in the CONFIG object and throws an Error upon invalid values.
 */


export const CONFIG = {
  app: {
    env: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    host: process.env.HOST
  },
  borchk: {
    uri: process.env.BORCHK_URI
  },
  culr: {
    uri: process.env.CULR_WSDL_URI,
    userIdAut: process.env.CULR_USER_ID_AUT,
    groupIdAut: process.env.CULR_GROUP_ID_AUT,
    passwordAut: process.env.CULR_PASSWORD_AUT
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
  hash: {
    shared: process.env.HASH_SHARED
  },
  log: {
    level: process.env.LOG_LEVEL,
    pretty: process.env.PRETTY_LOG === '1'
  },
  mock_externals: {
    borchk: process.env.MOCK_BORCHK === '1',
    culr: process.env.MOCK_CULR === '1',
    nemlogin: process.env.MOCK_NEMLOGIN === '1',
    openAgency: process.env.MOCK_OPENAGENCY === '1',
    smaug: process.env.MOCK_SMAUG === '1',
    unilogin: process.env.MOCK_UNILOGIN === '1',
    wayf: process.env.MOCK_WAYF === '1'
  },
  mock_storage: process.env.MOCK_STORAGE === '1',
  openAgency: {
    uri: process.env.OPENAGENCY_URI
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
  session: {
    life_time: Number(process.env.SESSION_LIFE_TIME)
  },
  smaug: {
    uri: process.env.SMAUG_URI
  },
  unilogin: {
    id: process.env.UNI_LOGIN_ID,
    secret: process.env.UNI_LOGIN_SECRET,
    uniloginBasePath: process.env.UNI_LOGIN_URL,
    maxTicketAge: process.env.UNI_LOGIN_MAX_TICKET_AGE || 60
  },
  gatewayf: {
    uri: process.env.GATEWAYF_URI,
    idp: {
      nemlogin: 'nemlogin',
      wayf: 'wayf'
    }
  },
  test: {
    host: process.env.TEST_HOST || null,
    token: process.env.TEST_TOKEN || 'asdfg'
  }
};

/**
 * Recursive functon that validates that all params in the above CONFIG object is set.
 * Number are validated to be non-NaN numbers.
 *
 * @param {Object} config
 * @param {string} k String used for printing out which config param is missing
 */
export function validateConfig(config = CONFIG, k = '') {
  for (let key in config) {
    if (typeof config[key] === 'object') {
      validateConfig(config[key], `${k}${key}.`);
    }
    else {
      if (config[key] === undefined) { // eslint-disable-line no-undefined
        throw Error(`${k}${key} was not specified in config. See https://github.com/DBCDK/hejmdal#environment-variabler for a list of environment variables and take a look at https://github.com/DBCDK/hejmdal/blob/master/src/utils/config.util.js to see how they're mapped`); // eslint-disable-line max-len
      }
      if (typeof config[key] === 'number' && Number.isNaN(config[key])) {
        throw Error(`${k}${key}: expected NaN to be a number. See https://github.com/DBCDK/hejmdal#environment-variabler for a list of environment variables and take a look at https://github.com/DBCDK/hejmdal/blob/master/src/utils/config.util.js to see how they're mapped`); // eslint-disable-line max-len
      }
    }
  }
}
