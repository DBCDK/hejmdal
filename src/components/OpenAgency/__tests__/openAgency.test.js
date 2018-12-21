/* eslint-disable no-undefined */
import {CONFIG} from '../../../utils/config.util';
import {
  libraryListFromName,
  libraryListFromPosition
} from '../openAgency.client';

describe('Test openAgency component', () => {
  const _SAVE_CONFIG = CONFIG.mock_externals.openAgency;
  beforeEach(() => {
    CONFIG.mock_externals.openAgency = true;
  });

  afterEach(() => {
    CONFIG.mock_externals.openAgency = _SAVE_CONFIG;
  });

  it('Lookup a library from name', async () => {
    const list = [
      {
        agencyId: '761500',
        branchId: '761500',
        agencyName: 'Horsens',
        branchName: 'Horsens Bibliotek',
        branchShortName: 'Horsens Bibliotek',
        city: 'Horsens',
        address: 'Tobaksgården 12Postbox 521',
        type: 'Folkebibliotek',
        branchWebsiteUrl: 'https://horsensbibliotek.dk',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        branchEmail: 'bibliotek@horsens.dk',
        distance: '',
        municipalityNo: '615'
      },
      {
        agencyId: '860970',
        branchId: '860970',
        agencyName: 'Horsens Gymnasium, Biblioteket',
        branchName: 'Horsens Gymnasium, Biblioteket',
        branchShortName: '',
        city: '',
        address: '',
        type: 'Forskningsbibliotek',
        branchWebsiteUrl: '',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        branchEmail: undefined
      },
      {
        agencyId: '874540',
        branchId: '874540',
        agencyName: 'Horsens Statsskole, Biblioteket',
        branchName: 'Horsens Statsskole, Biblioteket',
        branchShortName: '',
        city: '',
        address: '',
        type: 'Forskningsbibliotek',
        branchWebsiteUrl: '',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        branchEmail: undefined
      },
      {
        agencyId: '861340',
        branchId: '861340',
        agencyName: 'Learnmark Horsens',
        branchName: 'Learnmark Horsens',
        branchShortName: '',
        city: ' ',
        address: ' ',
        type: 'Forskningsbibliotek',
        branchWebsiteUrl: '',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        branchEmail: undefined
      }
    ];

    expect(list).toEqual(await libraryListFromName('horsen?'));
  });

  it('Lookup a library from position', async () => {
    const list = [
      {
        agencyId: '715100',
        branchId: '715100',
        agencyName: 'Ballerup',
        branchName: 'Ballerup Bibliotek',
        branchShortName: '',
        city: '',
        address: 'Hovedbiblioteket Banegårdspladsen 1',
        type: 'Folkebibliotek',
        branchWebsiteUrl: '',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        branchEmail: '',
        distance: '1237',
        municipalityNo: '151'
      },
      {
        agencyId: '724000',
        branchId: '724000',
        agencyName: 'Egedal',
        branchName: 'Smørum Bibliotek',
        branchShortName: '',
        city: '',
        address: 'Flodvej 68 Smørumnedre',
        type: 'Folkebibliotek',
        branchWebsiteUrl: '',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        branchEmail: '',
        distance: '2905',
        municipalityNo: '240'
      }
    ];

    expect(list).toEqual(await libraryListFromPosition('55.72', '12.35'));
  });

  it('Lookup a library not there', async () => {
    const empty = [];
    expect(empty).toEqual(await libraryListFromName('notFound'));
  });
});
