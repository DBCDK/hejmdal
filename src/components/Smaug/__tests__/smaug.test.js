import {assert} from 'chai';
import {CONFIG} from '../../../utils/config.util';
import {VERSION_PREFIX} from '../../../utils/version.util';
import {mockData} from '../mock/smaug.client.mock';
import * as smaug from '../smaug.component';
import {mockContext} from '../../../utils/test.util';

describe('Test smaug component', () => {

  // Save original config so it can be restored
  const _SMAUG_CONFIG = CONFIG.mock_externals.smaug;

  // Contains the context object
  let ctx;

  beforeEach(() => {
    CONFIG.mock_externals.smaug = true;
    ctx = mockContext('valid_token');

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
      identityProviders: ['nemlogin', 'borchk', 'unilogin'],
      attributes: {
        cpr: {name: 'CPR-nummer', description: 'Brugerens CPR-nummer'},
        birthDate: {
          name: 'Fødselsdato',
          description: 'Fødselsdato - 6 første cifre af CPR-nummer'
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
        municipality: {name: 'Kommunenummer', description: '3 cifret kommunenummer'}
      },
      urls: {
        host: `http://localhost:${CONFIG.app.port}${VERSION_PREFIX}`,
        success: '/example/example.html',
        error: '/thumbsdown'
      }
    });
  });

  it('should add empty default attributes', async() => {
    delete mockData.identityProviders;
    delete mockData.attributes;
    await smaug.getAttributes(ctx, () => {});
    assert.deepEqual(ctx.session.state.serviceClient, {
      id: 'a40f3dd8-e426-4e49-b7df-f16a64a3b62f',
      identityProviders: [],
      attributes: [],
      urls: {
        host: `http://localhost:${CONFIG.app.port}${VERSION_PREFIX}`,
        success: '/example/example.html',
        error: '/thumbsdown'
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
