/* eslint-disable no-undefined */
import {CONFIG} from '../../../utils/config.util';
import {
  libraryListFromName,
  libraryListFromPosition
} from '../vipCore.client';

describe('Test vipCore component', () => {
  const _SAVE_CONFIG = CONFIG.mock_externals.vipCore;
  beforeEach(() => {
    CONFIG.mock_externals.vipCore = true;
  });

  afterEach(() => {
    CONFIG.mock_externals.vipCore = _SAVE_CONFIG;
  });

  it('Lookup a library from name', async () => {
    const list = [
      {
        address: 'Kongevejen 30, Endelave',
        agencyId: '761500',
        agencyName: 'Horsens',
        branchEmail: 'bibliotek@horsens.dk',
        branchId: '761502',
        branchName: 'Endelave Bibliotek',
        branchShortName: 'Endelave',
        branchWebsiteUrl: 'https://horsensbibliotek.dk',
        city: 'Horsens',
        distance: '',
        municipalityNo: '615',
        registrationFormUrl: 'https://horsensbibliotek.dk/registration',
        registrationFormUrlText: 'Opret biblioteksbruger',
        type: 'Folkebibliotek'
      },
      {
        agencyId: '761500',
        branchId: '761500',
        agencyName: 'Horsens',
        branchName: 'Horsens Bibliotek',
        branchShortName: 'Horsens Bibliotek',
        city: 'Horsens',
        address: 'Tobaksgården 12\r\nPostbox 521',
        type: 'Folkebibliotek',
        branchWebsiteUrl: 'https://horsensbibliotek.dk',
        registrationFormUrl: 'https://horsensbibliotek.dk/registration',
        registrationFormUrlText: 'Opret biblioteksbruger',
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
        branchEmail: ''
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
        branchEmail: ''
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
        branchEmail: ''
      },
      {
        address: 'Ane Stauningsvej 21',
        agencyId: '831260',
        agencyName: 'Social- og Sundhedsskolen Fredericia, Biblioteket',
        branchEmail: 'vme@sosufvh.dk',
        branchId: '861940',
        branchName: 'Social- og Sundhedsskolen Horsens, Biblioteket',
        branchShortName: 'SSH Horsens',
        branchWebsiteUrl: '',
        city: 'Horsens',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        type: 'Forskningsbibliotek'
      },
      {
        address: 'Ravnebjerget 12, Søvind',
        agencyId: '761500',
        agencyName: 'Horsens',
        branchEmail: 'biblioteksoevind@horsens.dk',
        branchId: '761506',
        branchName: 'Søvind Bibliotek',
        branchShortName: 'Søvind Bibliotek',
        branchWebsiteUrl: 'https://horsensbibliotek.dk',
        city: 'Horsens',
        distance: '',
        municipalityNo: '615',
        registrationFormUrl: 'https://horsensbibliotek.dk/registration',
        registrationFormUrlText: 'Opret biblioteksbruger',
        type: 'Folkebibliotek'
      },
      {
        address: 'Chr. M. Østergaards Vej 4',
        agencyId: '831020',
        agencyName: 'VIA Bibliotek',
        branchEmail: 'bibhorsens@via.dk',
        branchId: '830410',
        branchName: 'VIA Biblioteket Campus Horsens',
        branchShortName: 'VIA UC. Bibl. Campus Horsens',
        branchWebsiteUrl: 'https://www.bibliotekerne.via.dk',
        city: 'Horsens',
        distance: '',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        type: 'Forskningsbibliotek'
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
        branchShortName: 'Ballerup Bibliotek',
        city: 'Ballerup',
        address: 'Banegårdspladsen 1',
        type: 'Folkebibliotek',
        branchWebsiteUrl: 'https://bib.ballerup.dk',
        registrationFormUrl: 'https://bib.ballerup.dk/registration',
        registrationFormUrlText: 'Opret dig som låner med MitID',
        branchEmail: 'ballerup-bibliotek@balk.dk',
        distance: '1237',
        municipalityNo: '151'
      },
      {
        agencyId: '724000',
        branchId: '724000',
        agencyName: 'Egedal',
        branchName: 'Smørum Bibliotek',
        branchShortName: 'Smørum Bibliotek',
        city: 'Smørum',
        address: 'Flodvej 68 Smørumnedre',
        type: 'Folkebibliotek',
        branchWebsiteUrl: 'http://www.egedalbibliotekerne.dk',
        registrationFormUrl: 'https://egedalbibliotekerne.dk/registration',
        registrationFormUrlText: 'Opret biblioteksbruger',
        branchEmail: 'smorum.bibliotek@egekom.dk',
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
