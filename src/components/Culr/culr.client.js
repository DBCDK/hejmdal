/**
 * @file
 * Client for communicating with the CULR webservice
 */

import soap from 'soap';
import {log} from '../../utils/logging.util';
import {CONFIG} from '../../utils/config.util';

let CulrClient;
const CULR_AUTH_CREDENTIALS = {
  userIdAut: CONFIG.culr.userIdAut,
  groupIdAut: CONFIG.culr.groupIdAut,
  passwordAut: CONFIG.culr.passwordAut,
  profileName: CONFIG.culr.profileName
};

export function getAccounts({userIdType, userIdValue}) {
  const params = {
    userCredentials: {
      userIdType: userIdType, //'CPR',
      userIdValue: userIdValue, //'5555666677'
    },
    authCredentials: CULR_AUTH_CREDENTIALS
  };

  return new Promise((resolve, reject) => {
    CulrClient.getAccounts(params, (err, result) => {
      if(err){
        reject(err);
      } else {
        resolve(result);
      }
    });
  })
}

export function init() {
  const options = {
    ignoredNamespaces: {
      namespaces: [],
      override: true
    }
  };

  soap.createClient(CONFIG.culr.uri, options, (err, client) => {
    if (err) {
      log.error('Error when creating CULR client', {error: err});
      return false;
    }

    client.on('request', (request) => {
      log.debug('A request was made to CULR', request);
    });

    client.on('resppnse', (response) => {
      log.debug('A response was received from CULR', response);
    });

    CulrClient = client;
  });
}
