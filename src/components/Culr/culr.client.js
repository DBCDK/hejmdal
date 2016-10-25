/**
 * @file
 * Client for communicating with the CULR webservice
 */

import soap from 'soap';
import {log} from '../../utils/logging.util';
import {CONFIG} from '../../utils/config.util';

let CulrClient = null;
const CULR_AUTH_CREDENTIALS = {
  userIdAut: CONFIG.culr.userIdAut,
  groupIdAut: CONFIG.culr.groupIdAut,
  passwordAut: CONFIG.culr.passwordAut,
  profileName: CONFIG.culr.profileName
};

if (!CulrClient) {
  init();
}

/**
 * Invokes the getAccount CULR method
 *
 * @param userIdValue CPR of the given user
 * @return {Promise}
 */
export async function getAccounts({userIdValue}) {
  const params = {
    userCredentials: {
      userIdType: 'CPR',
      userIdValue: userIdValue
    },
    authCredentials: CULR_AUTH_CREDENTIALS
  };

  return new Promise((resolve, reject) => {
    if (!CulrClient) {
      throw new Error('CULR client is not initialised');
    }
    CulrClient.getAccounts(params, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(result);
      }
    });
  });
}

/**
 * Initializes the CULR webservice. If MOCK_CULR (CONFIG.mock_externals.culr) is true a mock of the webservice will be
 * created.
 */
export function init() {
  const options = {
    ignoredNamespaces: {
      namespaces: [],
      override: true
    }
  };

  if (CONFIG.mock_externals.culr) {
    setMockClient();
  }
  else {
    soap.createClient(CONFIG.culr.uri, options, (err, client) => {
      if (err) {
        log.error('Error when creating CULR client', {error: err});
        return false;
      }

      client.on('request', (request) => {
        log.debug('A request was made to CULR', {request: request});
      });

      client.on('response', (response) => {
        log.debug('A response was received from CULR', {response: response});
      });

      CulrClient = client;
    });
  }
}

function setMockClient() {
  CulrClient = require('./culr.client.mock').CulrMockClient;
}
