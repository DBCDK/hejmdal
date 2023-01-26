import {fetchSubscribersByProduct, checkAgencyForProduct, fetchDbcidpAuthorize} from '../dbcidp.client';
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
    const response = await fetchDbcidpAuthorize('', {agency: 'default'});
    expect(response).toEqual({authenticated: false});
  });

  it('DBCIDP with rights (790900)', async () => {
    const response = await fetchDbcidpAuthorize('', {agency: '790900'});
    const expected = {
      agencyId: '790900',
      authenticated: true,
      guid: 'some-guid',
      identity: 'idt1234',
      roles: ['biblioteksadmin', 'biblioteksansat', 'NETPUNKT'],
      userInfo: {
        contactMail: 'usersname@dbc.dk',
        contactPhone: '42424242',
        name: 'User S Name'
      },
      rights: [
        {productName: 'INFOMEDIA', name: 'READ', description: 'Is allowed to read from INFOMEDIA'},
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

  it('Fetch list of subscribers for filmstriben', async () => {
    const response = await fetchSubscribersByProduct('filmstriben');
    const expected = {
      organisations: [
      {
        id: 1630,
        modified: '2021-06-28T12:52:44.313+02:00',
        created: '2021-06-28T12:52:44.313+02:00',
        url: 'http://idpservice.iscrum-prod.svc.cloud.dbc.dk/api/v1/organisation/1630/',
        version: 1,
        agencyId: '710100',
        agencyName: 'Hovedbiblioteket, Krystalgade'
      },
      {
        id: 1602,
        modified: '2021-06-28T12:52:43.861+02:00',
        created: '2021-06-28T12:52:43.861+02:00',
        url: 'http://idpservice.iscrum-prod.svc.cloud.dbc.dk/api/v1/organisation/1602/',
        version: 1,
        agencyId: '715100',
        agencyName: 'Ballerup Bibliotek'
      }
    ]
    };
    expect(response).toEqual(expected);
  });

  it('Should find product for library', async () => {
    const response = await checkAgencyForProduct('710100', 'filmstriben');
    expect(response).toBeTruthy();
  });

  it('Should not find product for library', async () => {
    const response = await checkAgencyForProduct('790900', 'filmstriben');
    expect(response).toBeFalsy();
  });

  it('Should not find product for library', async () => {
    const response = await checkAgencyForProduct('710100', 'noProduct');
    expect(response).toBeFalsy();
  });
});
