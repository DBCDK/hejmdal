import {fetchDbcidpRights} from '../dbcidp.client';
import {CONFIG} from '../../../utils/config.util';

describe('Test DBCIDP', () => {
  const _SAVE_CONFIG = CONFIG.mock_externals.dbcidp;
  beforeEach(() => {
    CONFIG.mock_externals.dbcidp = true;
  });
  afterEach(() => {
    CONFIG.mock_externals.dbcidp = _SAVE_CONFIG;
  });

  it('DBCIDP with no rights (agency not found, wrong password, etc.)', async () => {
    const response = await fetchDbcidpRights('default');
    expect(response).toEqual({});
  });

  it('DBCIDP with rights (790900)', async () => {
    const response = await fetchDbcidpRights('790900');
    const expected = {
      agencyId: '790900', rights: [
        {productName: 'INFOMEDIA', name: 'READ', description: 'Is allowed to read from INFORMEDIA'},
        {productName: 'ARTICLEFIRST', name: 'READ', description: 'Is allowed to read from ArticleFirst'},
        {productName: 'BOB', name: 'READ', description: 'Is allowed to read from BOB'},
        {productName: 'WORLDCAT', name: 'READ', description: 'Is allowed to read from WorldCat'},
        {productName: 'POSTHUS', name: 'READ', description: 'Is allowed to read from Posthus'},
        {productName: 'BIBSYS', name: 'READ', description: 'Is allowed to read from Bibsys'},
        {productName: 'LITTERATURTOLKNINGER', name: 'READ', description: 'Is allowed to read from Litteraturtolkninger'},
        {productName: 'DANBIB', name: 'READ', description: 'Is allowed to read from Danbib'},
        {productName: 'MATERIALEVURDERINGER', name: 'READ', description: 'Is allowed to read from Materialevurderinger'},
        {productName: 'VEJVISER', name: 'READ', description: 'Is allowed to read from VEJVISER'},
        {productName: 'EMNEORD', name: 'READ', description: 'Is allowed to read from Emneordsbasen'}
      ]
    };
    expect(response).toEqual(expected);
  });
});
