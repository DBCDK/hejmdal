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
        id: '761500',
        branchId: '761500',
        name: 'Horsens Bibliotek',
        address: 'Kongevejen 30, Endelave',
        type: 'Folkebibliotek',
        branchEmail: '',
        registrationFormUrl: '',
        registrationFormUrlText: ''
      },
      {
        id: '761500',
        branchId: '761506',
        name: 'Søvind Bibliotek',
        address: 'Ravnebjerget 12, Søvind',
        type: 'Folkebibliotek',
        branchEmail: '',
        registrationFormUrl: '',
        registrationFormUrlText: ''
      },
      {
        id: '860970',
        branchId: '860970',
        name: 'Horsens Gymnasium, Biblioteket',
        address: '',
        type: 'Forskningsbibliotek',
        branchEmail: '',
        registrationFormUrl: '',
        registrationFormUrlText: ''
      }];
    assert.deepEqual(list, await libraryListFromName('horsen?'));
  });

  it('Lookup a library from position', async() => {
    const list = [
      {
        id: '715100',
        branchId: '715100',
        name: 'Ballerup Bibliotek',
        address: 'Hovedbiblioteket Banegårdspladsen 1',
        type: 'Folkebibliotek',
        distance: '1237',
        branchEmail: '',
        registrationFormUrl: '',
        registrationFormUrlText: ''
      },
      {
        id: '724000',
        branchId: '724000',
        name: 'Smørum Bibliotek',
        address: 'Flodvej 68 Smørumnedre',
        type: 'Folkebibliotek',
        distance: '2905',
        branchEmail: '',
        registrationFormUrl: '',
        registrationFormUrlText: ''
      }];
    assert.deepEqual(list, await libraryListFromPosition('55.72', '12.35'));
  });

  it('Lookup a library not there', async() => {
    const empty = [];
    assert.deepEqual(empty, await libraryListFromName('notFound'));
  });
});
