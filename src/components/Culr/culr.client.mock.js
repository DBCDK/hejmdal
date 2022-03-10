/**
 * @file
 * Creates a static mock CULR client
 */

const defaultLibraies = [
  {
    provider: '790900',
    uidType: 'CPR',
    uidValue: '0102031111'
  },
  {
    provider: '100800',
    uidType: 'LOCAL-1',
    uidValue: '456456'
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
        uidType: 'CPR',
        uidValue: '0101011234'
      }
    ]
  });

  globalAccounts.set('0102030410', {
    Account: [
      {
        provider: '737000',
        uidType: 'CPR',
        uidValue: '0102030410'
      },
      {
        provider: '732900',
        uidType: 'CPR',
        uidValue: '0102030410'
      }
    ],
    MunicipalityNo: '329'
  });

  globalAccounts.set('0102030411', {
    Account: [
      {
        provider: '737000',
        uidType: 'CPR',
        uidValue: '0102030411'
      },
      {
        provider: '732900',
        uidType: 'CPR',
        uidValue: '0102030411'
      }
    ],
    MunicipalityNo: '329'
  });

  localAccounts = new Map();
  localAccounts.set('87654321', {
    Account: [
      {
        provider: '733000',
        uidType: 'LOCAL',
        uidValue: '87654321'
      }
    ],
    MunicipalityNo: '909'
  });
}
initMock();

export const CulrMockClient = {
  /**
   * getAccountsByGlobalId mock. If the value of params.userCredentials.uidValue matches '1234567890' a OK200 response will be
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
    const userExistGlobal = globalAccounts.has(userCredentials.uidValue);
    const userExistLocal = localAccounts.has(userCredentials.uidValue);
    const uidType = userCredentials.uidType;
    let account = {Account: []};

    // If uidType is local (no CPR)
    if (uidType === 'LOCAL') {
      if (userExistLocal) {
        account = localAccounts.get(userCredentials.uidValue);
      } else {
        localAccounts.set(userCredentials.uidValue, {Account: []});
        account = localAccounts.get(userCredentials.uidValue);
      }
    }

    // If uidType is CPR
    if (uidType === 'CPR') {
      if (userExistGlobal) {
        account = globalAccounts.get(userCredentials.uidValue);
      } else {
        globalAccounts.set(userCredentials.uidValue, {Account: []});
        account = globalAccounts.get(userCredentials.uidValue);
      }
    }

    account.Account.push({
      provider: agencyId,
      uidType: userCredentials.uidType,
      uidValue: userCredentials.uidValue
    });

    if (municipalityNo) {
      account.MunicipalityNo = municipalityNo;
    }

    // Add to localAccounts, if user DO NOT have CPR
    if (uidType === 'LOCAL') {
      localAccounts.set(userCredentials.uidValue, account);
    }

    // Add to globalAccounts, if user have CPR
    if (uidType === 'GLOBAL') {
      globalAccounts.set(userCredentials.uidValue, account);
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
