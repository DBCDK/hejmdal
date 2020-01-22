/**
 * @file
 * Client for communicating with the CULR webservice
 */

import * as soap from 'soap';
import startTiming from '../../utils/timing.util';
import {log} from '../../utils/logging.util';
import {CONFIG} from '../../utils/config.util';
let CulrClient = null;
const CULR_AUTH_CREDENTIALS = {
  userIdAut: CONFIG.culr.userIdAut,
  groupIdAut: CONFIG.culr.groupIdAut,
  passwordAut: CONFIG.culr.passwordAut
};

const CULR_CREATE_AUTH_CREDENTIALS = CONFIG.culr.createAuth;
/**
 * Invokes the getAccountsByGlobalId CULR method
 *
 * @param userIdValue CPR of the given user
 * @return {Promise}
 */
export async function getAccountsByGlobalId({userIdValue}) {
  const stopTiming = startTiming();

  if (!CulrClient) {
    await init();
  }
  const params = {
    userCredentials: {
      userIdType: 'CPR',
      userIdValue: userIdValue
    },
    authCredentials: CULR_AUTH_CREDENTIALS
  };

  const response = (await CulrClient.getAccountsByGlobalIdAsync(params))[0];
  const elapsedTimeInMs = stopTiming();
  log.debug('timing', {
    service: 'Culr',
    method: 'getAccountsByGlobalId',
    ms: elapsedTimeInMs
  });
  return response;
}

/**
 * Invokes the getAccountsByLocalId CULR method
 *
 * @param userIdValue
 * @param agencyId
 * @returns {Promise}
 */
export async function getAccountsByLocalId({userIdValue, agencyId}) {
  const stopTiming = startTiming();

  if (!CulrClient) {
    await init();
  }
  const params = {
    userCredentials: {
      agencyId: agencyId,
      userIdValue: userIdValue
    },
    authCredentials: CULR_AUTH_CREDENTIALS
  };

  const response = (await CulrClient.getAccountsByLocalIdAsync(params))[0];
  const elapsedTimeInMs = stopTiming();
  log.debug('timing', {
    service: 'Culr',
    function: 'getAccountsByLocalId',
    ms: elapsedTimeInMs
  });

  return response;
}

/**
 * Add a Patron to CULR.
 *
 * @export
 */
export async function createAccount({
  userIdType = 'CPR',
  userIdValue,
  agencyId,
  municipalityNo = null
}) {
  const stopTiming = startTiming();

  const params = {
    agencyId,
    userCredentials: {
      userIdType,
      userIdValue
    },
    authCredentials: CULR_CREATE_AUTH_CREDENTIALS
  };
  if (municipalityNo) {
    params.municipalityNo = municipalityNo;
  }
  if (!CulrClient) {
    await init();
  }
  const response = (await CulrClient.createAccountAsync(params))[0];
  const elapsedTimeInMs = stopTiming();
  log.debug('timing', {
    service: 'Culr',
    method: 'createAccount',
    ms: elapsedTimeInMs
  });

  return response;
}
/**
 * Initializes the CULR webservice. If MOCK_CULR (CONFIG.mock_externals.culr) is true a mock of the webservice will be
 * created.
 */
export async function init(mock = CONFIG.mock_externals.culr) {
  const options = {
    ignoredNamespaces: {
      namespaces: [],
      override: true
    }
  };
  if (mock) {
    setMockClient();
    return Promise.resolve(CulrClient);
  }
  if (!CulrClient) {
    try {
      const client = await soap.createClientAsync(CONFIG.culr.uri, options);
      client.on('request', request => {
        log.debug('A request was made to CULR', {requestString: request});
      });
      client.on('response', response => {
        log.debug('A response was received from CULR', {
          responseString: response
        });
      });
      CulrClient = client;
    } catch (error) {
      log.error('Error when creating CULR client', {error});
      throw new Error('CULR client is not initialised');
    }
  }
  return CulrClient;
}

function setMockClient() {
  CulrClient = require('./culr.client.mock').CulrMockClient;
}
