import {assert} from 'chai';
import {CONFIG} from '../../../utils/config.util';
import {mockData} from '../mock/smaug.client.mock';
import * as smaug from '../smaug.component';

describe('Test smaug component', () => {

  // Save original config so it can be restored
  const _SMAUG_CONFIG = CONFIG.mock_externals.smaug;

  // Contains the context object
  let ctx;

  beforeEach(() => {
    CONFIG.mock_externals.smaug = true;
    ctx = {
      session: {
        state: {}
      },
      query: {
        token: null
      }
    };
  });

  afterEach(() => {
    CONFIG.mock_externals.smaug = _SMAUG_CONFIG;
  });

  it('should export functions', () => {
    assert.isFunction(smaug.getAttributes);
  });

  it('should add client token', async() => {
    ctx.query.token = 'valid_token';
    await smaug.getAttributes(ctx, () => {});
    assert.deepEqual(ctx.session.state.serviceClient, {
      id: 'a40f3dd8-e426-4e49-b7df-f16a64a3b62f',
      identityProviders: ['nemlogin', 'borchk', 'unilogin'],
      attributes: ['cpr', 'name', 'libraries', 'patronId', 'muncipality']
    });
  });

  it('should add empty default attributes', async() => {
    delete mockData.identityProviders;
    delete mockData.attributes;
    ctx.query.token = 'valid_token';
    await smaug.getAttributes(ctx, () => {});
    assert.deepEqual(ctx.session.state.serviceClient, {
      id: 'a40f3dd8-e426-4e49-b7df-f16a64a3b62f',
      identityProviders: [],
      attributes: []
    });
  });

  it('should not set client with invalid token', async() => {
    ctx.session.state = {};
    ctx.query.token = 'invalid';
    await smaug.getAttributes(ctx, () => {});
    assert.isUndefined(ctx.session.state.client);
    assert.equal(ctx.status, 403);
  });

  it('should throw error when invalid client', async() => {
    ctx.session.state = {};
    ctx.query.token = 'valid_token';
    delete mockData.app.clientId;
    await smaug.getAttributes(ctx, () => {});
    assert.isUndefined(ctx.session.state.client);
    assert.equal(ctx.status, 403);
  });
});
