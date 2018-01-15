import {assert} from 'chai';
import {CONFIG} from '../../../utils/config.util';
import {mockData} from '../mock/smaug.client.mock';
import * as smaug from '../smaug.component';
import {mockContext} from '../../../utils/test.util';

describe('Test Smaug component', () => {

  // Save original config so it can be restored
  const _SMAUG_CONFIG = CONFIG.mock_externals.smaug;

  // Contains the context object
  let ctx;

  beforeEach(() => {
    CONFIG.mock_externals.smaug = true;
    ctx = mockContext(CONFIG.test.token);
  });

  afterEach(() => {
    CONFIG.mock_externals.smaug = _SMAUG_CONFIG;
  });

  it('should export functions', () => {
    assert.isFunction(smaug.getAttributes);
  });

  it('should add client token', async() => {
    await smaug.getAttributes(ctx, () => {});
    assert.deepEqual(ctx.session.state.serviceClient, {
      id: 'a40f3dd8-e426-4e49-b7df-f16a64a3b62f',
      name: 'Test Service',
      identityProviders: ['nemlogin', 'borchk', 'unilogin', 'wayf'],
      logoutScreen: 'include',
      borchkServiceName: 'bibliotek.dk',
      attributes: {
        cpr: {name: 'CPR-nummer', description: 'Brugerens CPR-nummer'},
        birthDate: {
          name: 'Fødselsdato',
          description: 'Fødselsdato - 4 første cifre af CPR-nummer'
        },
        birthYear: {
          name: 'Fødselsår',
          description: '4 cifret fødselsår - taget fra CPR-nummer'
        },
        gender: {
          name: 'Køn',
          description: 'Brugerens køn, m (for male) eller f (for female)'
        },
        libraries: {
          name: 'Biblioteker',
          description: 'En liste over de biblioteker som kender brugeren'
        },
        municipality: {
          name: 'Kommunenummer',
          description: '3 cifret kommunenummer'
        },
        uniloginId: {
          name: 'UNI-login brugernavn',
          description: 'Brugerens identifikation hos UNI-Login'
        },
        userId: {
          name: 'Biblioteks bruger-id',
          description: 'Brugerens identitet på biblioteket - oftest CPR-nummer'
        },
        wayfId: {
          name: 'WAYF id',
          description: 'Brugerens identifikation hos WAYF'
        },
        token: {
          noConsent: true
        },
        uniqueId: {
          name: 'Bibliotekslogin id',
          description: 'Anonymiseret identifikation hos Bibliotekslogin'
        }
      },
      urls: {
        host: `http://localhost:${CONFIG.app.port}`,
        returnUrl: '/example/'
      }
    });
  });

  it('should return validated user token', async() => {
    await smaug.getAttributes(ctx, () => {});
    ctx.setUser({libraryId: '724000', userId: '87654321', pincode: '1234'});
    await smaug.getUserToken(ctx, () => {});
    assert.equal(ctx.session.state.validatedUserToken, 'qwerty123456asdfgh');
  });

  it('should add empty default attributes', async() => {
    delete mockData.identityProviders;
    delete mockData.attributes;
    await smaug.getAttributes(ctx, () => {});
    assert.deepEqual(ctx.session.state.serviceClient, {
      id: 'a40f3dd8-e426-4e49-b7df-f16a64a3b62f',
      name: 'Test Service',
      identityProviders: [],
      logoutScreen: 'include',
      borchkServiceName: 'bibliotek.dk',
      attributes: [],
      urls: {
        host: `http://localhost:${CONFIG.app.port}`,
        returnUrl: '/example/'
      }
    });
  });

  it('should not set client with invalid token', async() => {
    ctx = mockContext('invalid_token');
    await smaug.getAttributes(ctx, () => {});
    assert.deepEqual(ctx.session.state.serviceClient, {});
    assert.equal(ctx.status, 403);
  });

  it('should throw error when invalid client', async() => {
    delete mockData.app.clientId;
    await smaug.getAttributes(ctx, () => {});
    assert.equal(ctx.status, 403);
    assert.deepEqual(ctx.session.state.serviceClient, {});
  });
});
