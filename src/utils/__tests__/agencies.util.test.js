/**
 * @file
 * Unittesting methods in agencies.util.js
 */

import {assert} from 'chai';
import {getListOfAgenciesForFrontend, getAgencyName, mockSetAgencyList} from '../agencies.util.js';

const mockAgencyList = [
  {
    branchId: '710100',
    branchShortName: 'branchShortName_1',
    agencyName: 'agencyName_1',
    branchName: 'branchName_1',
    misc: 'extra info'
  },
  {
    branchId: '761500',
    branchShortName: 'branchShortName_2',
    agencyName: 'agencyName_2',
    branchName: 'branchName_2',
    misc: 'extra info'
  }
];

describe('Unittesting methods in agencies.util.js', async() => {
  mockSetAgencyList(mockAgencyList);

  it('should return a list of agencies', async() => {
    const expected = [
      {branchId: '710100', name: 'agencyName_1', hidden: '710100'},
      {branchId: '761500', name: 'agencyName_2', hidden: '761500'}
    ];

    assert.deepEqual(expected, await getListOfAgenciesForFrontend());
  });

  it('should find agency name from id', async() => {
    assert.equal('branchName_1', await getAgencyName('710100'));
  });

  it('should not find agency name from not defined id', async() => {
    assert.equal('Ukendt bibliotek: 910100', await getAgencyName('910100'));
  });
});

