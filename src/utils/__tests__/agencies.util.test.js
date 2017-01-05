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
    type: 'Folkebibliotek',
    misc: 'extra info'
  },
  {
    branchId: '123456',
    branchShortName: 'branchShortName_3',
    agencyName: 'agencyName_3',
    branchName: 'branchName_3',
    type: 'Forskningsbibliotek',
    misc: 'extra info'
  },
  {
    branchId: '234567',
    branchShortName: 'branchShortName_4',
    agencyName: 'agencyName_4',
    branchName: 'branchName_4',
    type: 'Forskningsbibliotek',
    misc: 'extra info'
  }
];

describe('Unittesting methods in agencies.util.js', async() => {
  mockSetAgencyList(mockAgencyList);

  it('should return a list of agencies', async() => {
    const expected = [
      {branchId: '710100', name: 'agencyName_1', hidden: '710100', type: 'folk'},
      {branchId: '761500', name: 'agencyName_2', hidden: '761500', type: 'folk'},
      {branchId: '123456', name: 'agencyName_3', hidden: '123456', type: 'forsk'},
      {branchId: '234567', name: 'agencyName_4', hidden: '234567', type: 'forsk'}
    ];

    const result = await getListOfAgenciesForFrontend();

    assert.deepEqual(expected, result);
  });

  it('should return Forskningsbiblioteker only', async() => {
    const expected = [
      {branchId: '123456', name: 'agencyName_3', hidden: '123456', type: 'forsk'},
      {branchId: '234567', name: 'agencyName_4', hidden: '234567', type: 'forsk'}
    ];

    const result = await getListOfAgenciesForFrontend('forsk');

    assert.deepEqual(expected, result);
  });

  it('should return Folkebiblioteker only', async() => {
    const expected = [
      {branchId: '710100', name: 'agencyName_1', hidden: '710100', type: 'folk'},
      {branchId: '761500', name: 'agencyName_2', hidden: '761500', type: 'folk'}
    ];

    const result = await getListOfAgenciesForFrontend('folk');

    assert.deepEqual(expected, result);
  });

  it('should find agency name from id', async() => {
    assert.equal('branchName_1', await getAgencyName('710100'));
  });

  it('should not find agency name from not defined id', async() => {
    assert.equal('Ukendt bibliotek: 910100', await getAgencyName('910100'));
  });
});

