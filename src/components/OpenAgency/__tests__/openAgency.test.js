import {assert} from 'chai';
import {CONFIG} from '../../../utils/config.util';
import {suggestLibraryList} from '../openAgency.client';
import {mockContext} from '../../../utils/test.util';

describe('Test openAgency component', () => {

  const _SAVE_CONFIG = CONFIG.mock_externals.openAgency;
  beforeEach(() => {
    CONFIG.mock_externals.openAgency = true;
  });

  afterEach(() => {
    CONFIG.mock_externals.openAgency = _SAVE_CONFIG;
  });

  const ctx = mockContext();

  it('Lookup a library', async() => {
    const list = [
      {
        id: '761500',
        branchId: '761500',
        name: 'Horsens Bibliotek',
        address: 'Kongevejen 30, Endelave',
        type: 'Folkebibliotek'
      },
      {
        id: '761500',
        branchId: '761506',
        name: 'Søvind Bibliotek',
        address: 'Ravnebjerget 12, Søvind',
        type: 'Folkebibliotek'
      },
      {
        id: '860970',
        branchId: '860970',
        name: 'Horsens Gymnasium, Biblioteket',
        address: '',
        type: 'Forskningsbibliotek'
      }];
    assert.deepEqual(list, await suggestLibraryList('horsen?'));
  });

  it('Lookup a library not there', async() => {
    const empty = [];
    assert.deepEqual(empty, await suggestLibraryList('notFound'));
  });
});
