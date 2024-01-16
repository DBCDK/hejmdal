/**
 * @file
 * Client for communicating with the idp service
 */

import {CONFIG} from '../../utils/config.util';
import getMockClient from './mock/dbcidp.client.mock';
import {promiseRequest} from '../../utils/request.util';
import {log} from '../../utils/logging.util';

/**
 * Function to retrieve rights and attributes from dbcidp for a given user
 *
 * @param accessToken {string}
 * @param user {agency: 123456, userId: 'someUser'}
 * @returns {Promise<{}>}
 */
export async function fetchDbcidpAuthorize(accessToken, user) {
  try {
    let resp;
    if (CONFIG.mock_externals.dbcidp) {
      resp = getMockClient(user.agency);
    } else {
      const params = {
        url: CONFIG.dbcidp.dbcidpUri + '/v2/authorize',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({token: accessToken, userIdAut: user.userId})
      };
      resp = await promiseRequest('post', params);
    }
    if (resp.statusCode !== 200) {
      return {};
    }
    return JSON.parse(resp.body);
  } catch (error) {
    log.error(
      `Error retrieving DBCIDP authorization for ${user.userId} @ ${user.agency}`,
      {
        error: error.message,
        stack: error.stack
      }
    );
  }
  return {};
}

/** Fetch the list of agencies who has license for a given product
 *
 * @param productName
 * @returns {Promise<{}|any>}
 */
export async function fetchSubscribersByProduct(productName) {
  try {
    let resp;
    if (CONFIG.mock_externals.dbcidp) {
      resp = getMockClient(productName);
    } else {
      const params = {
        url:
          CONFIG.dbcidp.dbcidpUri +
          '/v1/queries/subscribersbyproductname/' +
          productName,
        headers: {'Content-Type': 'application/json'}
      };
      resp = await promiseRequest('get', params);
    }
    if (resp.statusCode === 200) {
      return JSON.parse(resp.body);
    }
  } catch (error) {
    log.error(`Error retrieving subscribers in DBCIDP for ${productName}`, {
      error: error.message,
      stack: error.stack
    });
  }
  return {};
}


/**
 * Function to authenticate a user (netpunkt-triple) against DBCIDP
 *
 * @param userIdAut userIdAut, f.ex. 'netpunkt'
 * @param groupIdAut groupIdAut, f.ex. '716700'
 * @param passwordAut passwordAut, password for login
 * @returns {Promise<boolean|*>}
 */
export async function validateIdpUser(userIdAut, groupIdAut, passwordAut) {
  if (
    CONFIG.mock_externals.dbcidp &&
    userIdAut === 'valid-user' &&
    groupIdAut &&
    passwordAut
  ) {
    return true;
  }
  const idpUri = CONFIG.dbcidp.dbcidpUri + '/v1/authenticate';
  const body = {userIdAut, passwordAut, agencyId: groupIdAut};

  const params = {
    url: idpUri,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  try {
    const response = await promiseRequest('post', params);
    const parsedBody = JSON.parse(response.body);
    return parsedBody.authenticated;
  } catch (error) {
    log.error('Error validating DBCIDP access profile', {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
}

/**
 * Function to sending a request for a new password
 *
 * @param identity identity, f.ex. 'netpunkt'
 * @param agencyId agencyId, f.ex. '716700'
 *
 * @returns {Promise<boolean|*>}
 */
export async function requestNewPassword({identity, agencyId}) {
  const idpNewPasswordUri = CONFIG.dbcidp.dbcidpUri + '/v1/newpassword';
  const body = {identity, agencyId};
  const params = {
    url: idpNewPasswordUri,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  try {
    const response = await promiseRequest('post', params);
    return JSON.parse(response.body);
  } catch (error) {
    log.error('Error creating new password on DBCIDP', {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
}

/**
 * Check if DbcIdp webservice is up.
 *
 * @returns {Promise}
 */
export async function health() {
  return await promiseRequest('get', {
    uri: CONFIG.dbcidp.dbcidpUri.replace('api', '/health')
  });
}
