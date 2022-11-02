import * as soap from 'soap';
import _ from 'lodash';

jest.mock('soap');

const borchkMock = {
  on: jest.fn(),
  createAccountAsync: jest.fn(params => [params]),
  borrowerCheckComplexAsync: jest.fn(params => {
    if (
      _.isEqual(params, {
        serviceRequester: 'login.bib.dk',
        libraryCode: '710100',
        userId: '1234567890',
        userPincode: ''
      })
    ) {
      return [{requestStatus: 'ok'}];
    }

    if (
      _.isEqual(params, {
        serviceRequester: 'login.bib.dk',
        libraryCode: '790900',
        userId: '0102032222',
        userPincode: '1234'
      })
    ) {
      return [{requestStatus: 'ok', userPrivilege: [], blocked: false, municipalityNumber: 101}];
    }

    // ....
    if (
      _.isEqual(params, {
        serviceRequester: 'login.bib.dk',
        libraryCode: '761500',
        userId: '1234567890',
        userPincode: ''
      })
    ) {
      return [{requestStatus: 'borrower_not_found'}];
    }

    return [{requestStatus: 'ok'}];
  })
};

soap.createClientAsync.mockResolvedValue(borchkMock);
