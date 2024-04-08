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
// currently not used - requestNewPasswordStep[12] now facilitates new/change dbcidp password
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
 * Function to change password step 1 - request to send a mail with a code
 * returns {valid: true, agencyid: "nnnnnn", identity: "xxxxx", email: "aaa@bbb.cc"} or {message: 'some_message'} where 'some_message' is one or more of
 *   ILLEGAL_UNKNOWN_USER
 *   ILLEGAL_EMPTY_IDENTITY,
 *   ILLEGAL_EMPTY_AGENCYID,
 *   ILLEGAL_ACCESSPROFILE_MISSING,
 *   ILLEGAL_AGENCY_MISSING,
 * @param identity identity, f.ex. 'netpunkt'
 * @param agencyid agencyid, f.ex. '716700'
 * @param hash the hash send when requesting for a code
 * @returns {Promise<boolean>}
 */
export async function requestNewPasswordStep1({identity, agencyid, hash}) {
  const idpCodeForNewPasswordUri = CONFIG.dbcidp.dbcidpUri + '/v1/twofactor/step1';
  const body = {identity, agencyid, hash};
  const params = {
    url: idpCodeForNewPasswordUri,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  try {
    let response;
    if (CONFIG.mock_externals.dbcidp) {
      response = getMockClient(agencyid + identity);
    } else {
      response = await promiseRequest('post', params);
    }
    console.log('rpw', params);
    console.log('rpw', response.statusCode);
    console.log('rpw', response.body);
    return JSON.parse(response.body);
  } catch (error) {
    log.error('Error requesting step1 for new password on DBCIDP', {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
}

/**
 * Function to change password step 2
 * returns {valid: true, message: "PASSWORD_CHANGED", agencyid: "nnnnnn", identity: "xxxxx"} or {message: 'some_message'} where 'some_message' is one or more of
 *   ILLEGAL_UNKNOWN_USER
 *   ILLEGAL_MAX_TRIES
 *   ILLEGAL_INCORRECT_INPUT
 *   ILLEGAL_EMPTY_INPUT,
 *   ILLEGAL_EMPTY_IDENTITY,
 *   ILLEGAL_EMPTY_AGENCYID,
 *   ILLEGAL_EMPTY_PASSWORD,
 *   ILLEGAL_USERNAME,
 *   ILLEGAL_USERNAME_REVERSED,
 *   ILLEGAL_AGENCYID,
 *   ILLEGAL_AGENCYID_REVERSED,
 *   ILLEGAL_ACCESSPROFILE_MISSING,
 *   ILLEGAL_AGENCY_MISSING,
 *   TOO_SHORT,
 *   ILLEGAL_QWERTY_SEQUENCE,
 *   ILLEGAL_NUMERICAL_SEQUENCE,
 *   ILLEGAL_ALPHABETICAL_SEQUENCE,
 *   ILLEGAL_PASSWORD_REUSE
 *
 * @param identity identity, f.ex. 'netpunkt'
 * @param agencyid agencyId, f.ex. '716700'
 * @param hash the hash send when requesting for a code
 * @param secret the code returned in the users mail
 * @param password the current password
 * @returns {Promise<boolean>}
 */
export async function requestNewPasswordStep2({identity, agencyid, hash, secret, password}) {
  const idpNewPasswordUri = CONFIG.dbcidp.dbcidpUri + '/v1/twofactor/step2';
  const body = {identity, agencyid, hash, secret, password};
  const params = {
    url: idpNewPasswordUri,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  try {
    let response;
    if (CONFIG.mock_externals.dbcidp) {
      response = getMockClient(agencyid + identity);
    } else {
      response = await promiseRequest('post', params);
    }
    return JSON.parse(response.body);
  } catch (error) {
    log.error('Error requesting step2 for new password on DBCIDP', {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
}

/**
 * Function to sending a request to change password
 * returns {valid: true} or {valid: false, message: 'some_message'} where 'some_message' is one or more of
 *   ILLEGAL_EMPTY_INPUT,
 *   ILLEGAL_EMPTY_IDENTITY,
 *   ILLEGAL_EMPTY_AGENCYID,
 *   ILLEGAL_EMPTY_PASSWORD,
 *   ILLEGAL_USERNAME,
 *   ILLEGAL_USERNAME_REVERSED,
 *   ILLEGAL_AGENCYID,
 *   ILLEGAL_AGENCYID_REVERSED,
 *   ILLEGAL_ACCESSPROFILE_MISSING,
 *   ILLEGAL_AGENCY_MISSING,
 *   TOO_SHORT,
 *   ILLEGAL_QWERTY_SEQUENCE,
 *   ILLEGAL_NUMERICAL_SEQUENCE,
 *   ILLEGAL_ALPHABETICAL_SEQUENCE,
 *   ILLEGAL_PASSWORD_REUSE
 *   ILLEGAL_NOT_PERSONAL
 *
 * @param identity identity, f.ex. 'netpunkt'
 * @param agencyId agencyId, f.ex. '716700'
 * @param password the current password
 * @param newPassword the new password
 * @returns {Promise<boolean>}
 */
// currently not used - requestNewPasswordStep[12] now facilitates new/change dbcidp password
export async function requestChangePassword({identity, agencyId, password, newPassword}) {
  try {
    let response;
    if (CONFIG.mock_externals.dbcidp) {
      response = getMockClient(identity);
    } else {
      const idpChangePasswordUri = CONFIG.dbcidp.dbcidpUri + '/v1/password/change';
      const body = {identity, agencyId, password, newPassword};
      const params = {
        url: idpChangePasswordUri,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };
      response = await promiseRequest('post', params);
    }
    if (response.statusCode === 200) {
      return {message: 'OK200'};
    }
    return JSON.parse(response.body);
  } catch (error) {
    log.error('Error changing password on DBCIDP', {
      error: error.message,
      stack: error.stack
    });
    return {message: 'ERROR_PASSWORD_CHANGE'};
  }
}

/**
 * Function to sending a request to check for valid new password
 * returns {valid: true} or {valid: false, message: 'some_message'} where 'some_message' is explained above
 *
 * @param identity identity, f.ex. 'netpunkt'
 * @param agencyId agencyId, f.ex. '716700'
 * @param password the password to validate
 * @returns {Promise<boolean>}
 */
// currently not used - requestNewPasswordStep[12] now facilitates new/change dbcidp password
export async function requestValidatePassword({identity, agencyId, password}) {
  const idpValidatePasswordUri = CONFIG.dbcidp.dbcidpUri + '/v1/password/validate';
  const body = {identity, agencyId, password};
  const params = {
    url: idpValidatePasswordUri,
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
    log.error('Error changing password on DBCIDP', {
      error: error.message,
      stack: error.stack
    });
    return {valid: false, message: 'ERROR_PASSWORD_VALIDATE'};
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
