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
    serviceRequester: process.env.BORCHK_SERVICEREQUESTER,
    uri: process.env.BORCHK_WSDL_URI
  },
  culr: {
    uri: process.env.CULR_WSDL_URI,
    userIdAut: process.env.CULR_USER_ID_AUT,
    groupIdAut: process.env.CULR_GROUP_ID_AUT,
    passwordAut: process.env.CULR_PASSWORD_AUT,
    createAuth: {
      userIdAut: process.env.CULR_CREATE_USER_ID_AUT,
      groupIdAut: process.env.CULR_CREATE_GROUP_ID_AUT,
      passwordAut: process.env.CULR_CREATE_PASSWORD_AUT
    }
  },
  garbageCollect: {
    ticket: {
      divisor: Number(process.env.GC_TICKET_DIVISOR) || 1000,
      seconds: Number(process.env.GC_TICKET_SECONDS) || 3600 // 60 * 60
    },
    session: {
      divisor: Number(process.env.GC_SESSION_DIVISOR) || 1000,
      seconds: Number(process.env.GC_SESSION_SECONDS) || 2678400 // 31 * 24 * 60 * 60
    },
    failedLogin: {
      divisor: Number(process.env.GC_SESSION_DIVISOR) || 1000,
      seconds: Number(process.env.GC_SESSION_SECONDS) || 36000 // 10 * 60 * 60
    }
  },
  failedLogin: {
    ip: {
      maxFail: Number(process.env.FL_IP_MAXFAIL) || 100,
      blockSeconds: Number(process.env.FL_IP_BLOCK_SECONDS) || 1200,
      resetSeconds: Number(process.env.FL_IP_RESET_SECONDS) || 86400
    },
    userId: {
      maxFail: Number(process.env.FL_USER_MAXFAIL) || 2,
      blockSeconds: Number(process.env.FL_USER_BLOCK_SECONDS) || 1200,
      resetSeconds: Number(process.env.FL_USER_RESET_SECONDS) || 86400
    }
  },
  hash: {
    shared: process.env.HASH_SHARED,
    aes256Secret: process.env.AES_256_SECRET
  },
  log: {
    level: process.env.LOG_LEVEL,
    pretty: process.env.PRETTY_LOG === '1'
  },
  mock_externals: {
    borchk: process.env.MOCK_BORCHK === '1',
    culr: process.env.MOCK_CULR === '1',
    nemlogin: process.env.MOCK_NEMLOGIN === '1',
    vipCore: process.env.MOCK_VIPCORE === '1',
    smaug: process.env.MOCK_SMAUG === '1',
    unilogin: process.env.MOCK_UNILOGIN === '1',
    uniloginOidc: process.env.MOCK_UNILOGIN_OIDC === '1',
    wayf: process.env.MOCK_WAYF === '1',
    dbcidp: process.env.MOCK_DBCIDP === '1'
  },
  mock_storage: process.env.MOCK_STORAGE === '1',
  vipCore: {
    uri: process.env.VIPCORE_URI,
    life_time: Number(process.env.VIPCORE_LIFE_TIME) || 3600 // 60*60
  },
  postgres: {
    client: 'postgresql',
    connection: {
      host: process.env.HEJMDAL_DB_HOST,
      port: process.env.HEJMDAL_DB_PORT || 5432,
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
    life_time: Number(process.env.SESSION_LIFE_TIME),
    secret: process.env.SESSION_SECRET,
    sameSite: process.env.SAME_SITE || '',
    secure: process.env.SECURE_COOKIE || false,
    resave: process.env.RESAVE_SESSION || false
  },
  smaug: {
    uri: process.env.SMAUG_URI,
    oauthTokenUri: `${process.env.SMAUG_URI}/oauth/token`,
    configUri: process.env.SMAUG_CONFIG_URI,
    adminUri: process.env.SMAUG_ADMIN_URI,
    adminUsername: process.env.SMAUG_ADMIN_USERNAME,
    adminPassword: process.env.SMAUG_ADMIN_PASSWORD,
    hejmdalClientId: process.env.HEJMDAL_CLIENT_ID
  },
  unilogin: {
    wsUser: process.env.UNI_LOGIN_WS_USER,
    wsPassword: process.env.UNI_LOGIN_WS_PASSWORD,
    id: process.env.UNI_LOGIN_ID,
    secret: process.env.UNI_LOGIN_SECRET,
    uniloginBasePath: process.env.UNI_LOGIN_URL,
    maxTicketAge: process.env.UNI_LOGIN_MAX_TICKET_AGE || 60
  },
  unilogin_oidc: {
    id: process.env.UNILOGIN_OIDC_ID,
    secret: process.env.UNILOGIN_OIDC_SECRET,
    auth_url: `${process.env.UNILOGIN_OIDC_URL}/auth`,
    token_url: `${process.env.UNILOGIN_OIDC_URL}/token`,
    userinfo_url: `${process.env.UNILOGIN_OIDC_URL}/token/introspect`,
    logout_url: `${process.env.UNILOGIN_OIDC_URL}/logout`
  },
  dbcidp: {
    dbcidpUri: process.env.DBCIDP_URI
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
  },
  proxy: {
    trust: !!(Number(process.env.TRUST_PROXY) || 0)
  },
  municipalityHack: process.env.MUNICIPALITY_AGENCY_HACK || '100450 790900',
  municipalityAgencyTab: process.env.MUNICIPALITY_TO_AGENCY_TAB || '',
  removeAttributeAgencies: process.env.REMOVE_ATTRIBUTE_AGENCIES || '',
  localIdAgencies: process.env.LOCAL_ID_AGENCIES || ''
};

// 2DO figure out why cypress tests fail when included
// validateConfig(CONFIG);

/**
 * Recursive function that validates that all params in the above CONFIG object is set.
 * Number are validated to be non-NaN numbers.
 *
 * @param {Object} config
 * @param {string} k String used for printing out which config param is missing
 */
export function validateConfig(config = CONFIG, k = '') {
  for (let key in config) {
    if (typeof config[key] === 'object') {
      validateConfig(config[key], `${k}${key}.`);
    } else {
      /* eslint-disable no-undefined */
      if (config[key] === undefined) {
        /* eslint-enable no-undefined */

        /* eslint-disable max-len */
        throw Error(
          `${k}${key} was not specified in config. See https://github.com/DBCDK/hejmdal#environment-variabler for a list of environment variables and take a look at https://github.com/DBCDK/hejmdal/blob/master/src/utils/config.util.js to see how they're mapped`
        );
        /* eslint-enable max-len */
      }
      if (typeof config[key] === 'number' && Number.isNaN(config[key])) {
        /* eslint-disable max-len */
        throw Error(
          `${k}${key}: expected NaN to be a number. See https://github.com/DBCDK/hejmdal#environment-variabler for a list of environment variables and take a look at https://github.com/DBCDK/hejmdal/blob/master/src/utils/config.util.js to see how they're mapped`
        );
        /* eslint-enable max-len */
      }
    }
  }
}
