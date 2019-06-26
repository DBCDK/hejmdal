/**
 * @file
 * Creates a static mock CULR client
 */

const defaultLibraies = [
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
];

let accounts;
function initMock() {
  accounts = new Map();
  accounts.set('87654321', {Account: defaultLibraies, MunicipalityNo: '909'});
  accounts.set('5555666677', {
    Account: defaultLibraies,
    MunicipalityNo: '909'
  });
  accounts.set('0101011234', {
    Account: [
      {
        provider: '790900',
        userIdType: 'CPR',
        userIdValue: '0101011234'
      }
    ]
  });
}
initMock();

export const CulrMockClient = {
  /**
   * getAccountsByGlobalId mock. If the value of params.userCredentials.userIdValue matches '1234567890' a OK200 response will be
   * returned. Otherwise is a ACCOUNT_DOES_NOT_EXIST response is returned.
   *
   * @param {object} params
   * @param {function} cb
   */
  getAccountsByGlobalIdAsync: params => {
    const userId = params.userCredentials.userIdValue;
    if (accounts.has(userId)) {
      return Promise.resolve([OK200(accounts.get(userId), userId)]);
    }
    return Promise.resolve([ACCOUNT_DOES_NOT_EXIST()]);
  },
  getAccountsByLocalIdAsync: () => Promise.resolve([ACCOUNT_DOES_NOT_EXIST()]),
  createAccountAsync: ({userCredentials, agencyId, municipalityNo = null}) => {
    if (accounts.has(userCredentials.userIdValue)) {
      const account = accounts.get(userCredentials.userIdValue);
      account.Account.push({
        provider: agencyId,
        userIdType: userCredentials.userIdType,
        userIdValue: userCredentials.userIdValue
      });
      if (municipalityNo) {
        account.MunicipalityNo = municipalityNo;
      }
      accounts.set(userCredentials.userIdValue, account);
    }
    return Promise.resolve([CREATE_ACCOUNT()]);
  }
};

function OK200(data, userId) {
  return {
    result: {
      ...data,
      Guid: `guid-${userId}`,
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

function CREATE_ACCOUNT() {
  return {
    return: {
      responseStatus: {
        responseCode: 'OK200',
        responseMessage: 'Account created'
      }
    }
  };
}
