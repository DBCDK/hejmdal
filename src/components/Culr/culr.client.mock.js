/**
 * @file
 * Creates a static mock CULR client
 */

const defaultLibraies = [
  {
    provider: '790900',
    userIdType: 'CPR',
    userIdValue: '0102031111'
  },
  {
    provider: '100800',
    userIdType: 'LOCAL-1',
    userIdValue: '456456'
  }
];

let globalAccounts;
let localAccounts;

function initMock() {
  globalAccounts = new Map();
  globalAccounts.set('0102031111', {
    Account: defaultLibraies,
    MunicipalityNo: '909'
  });
  globalAccounts.set('0101011234', {
    Account: [
      {
        provider: '790900',
        userIdType: 'CPR',
        userIdValue: '0101011234'
      }
    ]
  });

  globalAccounts.set('0102030410', {
    Account: [
      {
        provider: '737000',
        userIdType: 'CPR',
        userIdValue: '0102030410'
      },
      {
        provider: '732900',
        userIdType: 'CPR',
        userIdValue: '0102030410'
      }
    ],
    MunicipalityNo: '615'
  });

  globalAccounts.set('0102030411', {
    Account: [
      {
        provider: '737000',
        userIdType: 'CPR',
        userIdValue: '0102030411'
      },
      {
        provider: '732900',
        userIdType: 'CPR',
        userIdValue: '0102030411'
      }
    ],
    MunicipalityNo: '329'
  });

  localAccounts = new Map();
  localAccounts.set('87654321', {
    Account: [
      {
        provider: '733000',
        userIdType: 'LOCAL',
        userIdValue: '87654321'
      }
    ],
    MunicipalityNo: '909'
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
    const userId = params.userCredentials.uidValue;
    if (globalAccounts.has(userId)) {
      return Promise.resolve([OK200(globalAccounts.get(userId), userId)]);
    }
    return Promise.resolve([ACCOUNT_DOES_NOT_EXIST()]);
  },
  getAccountsByLocalIdAsync: params => {
    const userId = params.userCredentials.userIdValue;
    if (localAccounts.has(userId)) {
      return Promise.resolve([OK200(localAccounts.get(userId), userId)]);
    }
    return Promise.resolve([ACCOUNT_DOES_NOT_EXIST()]);
  },
  createAccountAsync: ({userCredentials, agencyId, municipalityNo = null}) => {
    const userExistGlobal = globalAccounts.has(userCredentials.userIdValue);
    const userExistLocal = localAccounts.has(userCredentials.userIdValue);
    const userIdType = userCredentials.userIdType;
    let account = {Account: []};

    // If userIdType is local (no CPR)
    if (userIdType === 'LOCAL') {
      if (userExistLocal) {
        account = localAccounts.get(userCredentials.userIdValue);
      } else {
        localAccounts.set(userCredentials.userIdValue, {Account: []});
        account = localAccounts.get(userCredentials.userIdValue);
      }
    }

    // If userIdType is CPR
    if (userIdType === 'CPR') {
      if (userExistGlobal) {
        account = globalAccounts.get(userCredentials.userIdValue);
      } else {
        globalAccounts.set(userCredentials.userIdValue, {Account: []});
        account = globalAccounts.get(userCredentials.userIdValue);
      }
    }

    account.Account.push({
      provider: agencyId,
      userIdType: userCredentials.userIdType,
      userIdValue: userCredentials.userIdValue
    });

    if (municipalityNo) {
      account.MunicipalityNo = municipalityNo;
    }

    // Add to localAccounts, if user DO NOT have CPR
    if (userIdType === 'LOCAL') {
      localAccounts.set(userCredentials.userIdValue, account);
    }

    // Add to globalAccounts, if user have CPR
    if (userIdType === 'GLOBAL') {
      globalAccounts.set(userCredentials.userIdValue, account);
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
