/**
 * @file
 *
 */
import * as soap from 'soap';
import {CONFIG} from '../../utils/config.util';
import {log} from '../../utils/logging.util';
import startTiming from '../../utils/timing.util';

let BorcheckClient = null;

/**
 * Retreives if a user is known on a given library
 *
 * @param agency
 * @param userId
 * @param pinCode
 * @param serviceRequester
 * @returns {Promise<*>}
 */
export async function getClient(agency, userId, pinCode, serviceRequester) {
  const stopTiming = startTiming();

  if (!BorcheckClient) {
    await init();
  }
  const params = {
    serviceRequester: serviceRequester,
    libraryCode: agency,
    userId: userId,
    userPincode: pinCode
  };
  const response = await BorcheckClient.borrowerCheckAsync(params);
  const elapsedTimeInMs = stopTiming();
  log.debug('timing', {
    service: 'Borchk',
    method: 'borrowerCheck',
    ms: elapsedTimeInMs
  });
  log.debug('A request was made to BORCHK', {
    serviceRequester: serviceRequester,
    userId: userId,
    agency: agency,
    responseString: JSON.stringify(response)
  });
  return response[0];
}

export async function init() {
  const options = {
    ignoredNamespaces: {
      namespaces: [],
      override: true
    }
  };
  if (!BorcheckClient) {
    try {
      const client = await soap.createClientAsync(CONFIG.borchk.uri, options);
      BorcheckClient = client;
    } catch (error) {
      log.error('Error when creating BORCHK client', {error});
      throw new Error('BORCHK client is not initialised');
    }
  }
}
