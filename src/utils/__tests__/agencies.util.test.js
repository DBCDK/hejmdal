/**
 * @file
 * Unittesting methods in agencies.util.js
 */

import {
  getListOfAgenciesForFrontend,
  getAgencyName,
  mockSetAgencyList
} from '../agencies.util.js';

const mockAgencyList = [
  {
    branchId: '791011',
    branchShortName: 'branchShortName_0',
    agencyName: 'ægencyName_0',
    branchName: 'branchName_0',
    misc: 'extra info',
    municipalityNo: '910'
  },
  {
    branchId: '710100',
    branchShortName: 'branchShortName_1',
    agencyName: 'agencyName_1',
    branchName: 'branchName_1',
    misc: 'extra info',
    municipalityNo: '101'
  },
  {
    branchId: '761500',
    branchShortName: 'branchShortName_2',
    agencyName: 'agencyName_2',
    branchName: 'branchName_2',
    type: 'Folkebibliotek',
    misc: 'extra info',
    municipalityNo: '615'
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

describe('Unittesting methods in agencies.util.js', async () => {
  mockSetAgencyList(mockAgencyList);

  it('should return a sorted list of agencies', async () => {
    const expected = {
      folk: [
        {
          branchId: '710100',
          name: 'agencyName_1'
        },
        {
          branchId: '761500',
          name: 'agencyName_2'
        },
        {
          branchId: '791011',
          name: 'ægencyName_0'
        }
      ],
      forsk: [
        {
          branchId: '123456',
          name: 'agencyName_3'
        },
        {
          branchId: '234567',
          name: 'agencyName_4'
        }
      ],
      other: []
    };

    const result = await getListOfAgenciesForFrontend();

    expect(expected).toEqual(result);
  });

  it('should return Forskningsbiblioteker only', async () => {
    const expected = [
      {
        branchId: '123456',
        name: 'agencyName_3'
      },
      {
        branchId: '234567',
        name: 'agencyName_4'
      }
    ];

    const result = await getListOfAgenciesForFrontend('forsk');

    expect(expected).toEqual(result);
  });

  it('should return Folkebiblioteker only', async () => {
    const expected = [
      {
        branchId: '710100',
        name: 'agencyName_1'
      },
      {
        branchId: '761500',
        name: 'agencyName_2'
      },
      {branchId: '791011', name: 'ægencyName_0'}
    ];

    const result = await getListOfAgenciesForFrontend('folk');

    expect(expected).toEqual(result);
  });

  it('should find agency name from id', async () => {
    expect('branchName_1').toEqual(await getAgencyName('710100'));
  });

  it('should not find agency name from not defined id', async () => {
    expect('Ukendt bibliotek: 910100').toEqual(await getAgencyName('910100'));
  });
});
