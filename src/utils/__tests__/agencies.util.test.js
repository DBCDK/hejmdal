/**
 * @file
 * Unittesting methods in agencies.util.js
 */

import {assert} from 'chai';
import {getListOfAgenciesForFrontend, getAgencyName, mockSetAgencyList} from '../agencies.util.js';

const mockAgencyList = [
  {branchId: '710100', name: 'Hovedbiblioteket, Krystalgade', misc: 'extra info'},
  {branchId: '761500', name: 'Horsens Bibliotek', misc: 'extra info'}
];

describe('Unittesting methods in agencies.util.js', async() => {
  mockSetAgencyList(mockAgencyList);

  it('should return a list of agencies', async() => {
    const expected = [
      {branchId: '710100', name: 'Hovedbiblioteket, Krystalgade'},
      {branchId: '761500', name: 'Horsens Bibliotek'}
    ];
    assert.deepEqual(expected, await getListOfAgenciesForFrontend());
  });

  it('should find agency name from id', async() => {
    assert.equal('Hovedbiblioteket, Krystalgade', await getAgencyName('710100'));
  });

  it('should not find agency name from not defined id', async() => {
    assert.equal('Ukendt bibliotek: 910100', await getAgencyName('910100'));
  });
});

