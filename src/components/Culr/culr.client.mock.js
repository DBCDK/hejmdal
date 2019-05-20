/**
 * @file
 * Creates a static mock CULR client
 */

export const CulrMockClient = {
  /**
   * getAccountsByGlobalId mock. If the value of params.userCredentials.userIdValue matches '1234567890' a OK200 response will be
   * returned. Otherwise is a ACCOUNT_DOES_NOT_EXIST response is returned.
   *
   * @param {object} params
   * @param {function} cb
   */
  getAccountsByGlobalIdAsync: params => {
    if (params.userCredentials.userIdValue === '0101011234') {
      return Promise.resolve([USER_0101011234()]);
    }
    if (
      ['87654321', '5555666677'].includes(params.userCredentials.userIdValue)
    ) {
      return Promise.resolve([OK200()]);
    }
    return Promise.resolve([ACCOUNT_DOES_NOT_EXIST()]);
  },
  getAccountsByLocalIdAsync: () => Promise.resolve([ACCOUNT_DOES_NOT_EXIST()]),
  createAccountAsync: () => {
    return Promise.resolve([CREATE_ACCOUNT()]);
  }
};

function OK200() {
  return {
    result: {
      Account: [
        {
          provider: '790900',
          userIdType: 'CPR',
          userIdValue: '5555666677'
        },
        {
          provider: '100800',
          userIdType: 'LOCAL-1',
          userIdValue: '456456'
        }
      ],
      MunicipalityNo: '909',
      Guid: 'some-random-curl-id',
      responseStatus: {
        responseCode: 'OK200'
      }
    }
  };
}

function ACCOUNT_DOES_NOT_EXIST() {
  return {
    result: {
      responseStatus: {
        responseCode: 'ACCOUNT_DOES_NOT_EXIST',
        responseMessage: 'Account does not exist'
      }
    }
  };
}

/**
 * Following is used to test the create user flow.
 *
 * @see
 * e2e/cypress/integration/create_culr_user.js
 */

let created = false;
function USER_0101011234() {
  if (!created) {
    return ACCOUNT_DOES_NOT_EXIST();
  }
  return {
    result: {
      Account: [
        {
          provider: '790900',
          userIdType: 'CPR',
          userIdValue: '0101011234'
        }
      ],
      Guid: 'guid-0101011234',
      responseStatus: {
        responseCode: 'OK200'
      }
    }
  };
}

function CREATE_ACCOUNT() {
  created = true;
  return {
    return: {
      responseStatus: {
        responseCode: 'OK200',
        responseMessage: 'Account created'
      }
    }
  };
}
