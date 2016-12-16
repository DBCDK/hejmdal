import {assert} from 'chai';
import {CONFIG} from '../../../utils/config.util';
import {libraryListFromName, libraryListFromPosition} from '../openAgency.client';

describe('Test openAgency component', () => {

  const _SAVE_CONFIG = CONFIG.mock_externals.openAgency;
  beforeEach(() => {
    CONFIG.mock_externals.openAgency = true;
  });

  afterEach(() => {
    CONFIG.mock_externals.openAgency = _SAVE_CONFIG;
  });

  it('Lookup a library from name', async() => {
    const list = [
      {
        agencyId: '761500',
        branchId: '761500',
        agencyName: '',
        branchName: 'Horsens Bibliotek',
        branchShortName: '',
        city: '',
        address: 'Kongevejen 30, Endelave',
        type: 'Folkebibliotek',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        branchEmail: ''
      },
      {
        agencyId: '761500',
        branchId: '761506',
        agencyName: '',
        branchName: 'Søvind Bibliotek',
        branchShortName: '',
        city: '',
        address: 'Ravnebjerget 12, Søvind',
        type: 'Folkebibliotek',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        branchEmail: ''
      },
      {
        agencyId: '860970',
        branchId: '860970',
        agencyName: '',
        branchName: 'Horsens Gymnasium, Biblioteket',
        branchShortName: '',
        city: '',
        address: '',
        type: 'Forskningsbibliotek',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        branchEmail: ''
      }];

    assert.deepEqual(list, await libraryListFromName('horsen?'));
  });

  it('Lookup a library from position', async() => {
    const list = [
      {
        agencyId: '715100',
        branchId: '715100',
        agencyName: '',
        branchName: 'Ballerup Bibliotek',
        branchShortName: '',
        city: '',
        address: 'Hovedbiblioteket Banegårdspladsen 1',
        type: 'Folkebibliotek',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        branchEmail: '',
        distance: '1237'
      },
      {
        agencyId: '724000',
        branchId: '724000',
        agencyName: '',
        branchName: 'Smørum Bibliotek',
        branchShortName: '',
        city: '',
        address: 'Flodvej 68 Smørumnedre',
        type: 'Folkebibliotek',
        registrationFormUrl: '',
        registrationFormUrlText: '',
        branchEmail: '',
        distance: '2905'
      }];

    assert.deepEqual(list, await libraryListFromPosition('55.72', '12.35'));
  });

  it('Lookup a library not there', async() => {
    const empty = [];
    assert.deepEqual(empty, await libraryListFromName('notFound'));
  });
});
