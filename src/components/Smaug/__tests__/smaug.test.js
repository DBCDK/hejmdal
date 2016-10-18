import {assert} from 'chai';
import * as smaug from '../smaug.component';
import * as client from '../smaug.client';
import smaugMock from '../mock/smaug.client.mock';

describe('Test smaug component', () => {
  const ctx = {
    session: {
      state: {}
    },
    query: {
      token: null
    }
  };
  it('should export functions', () => {
    assert.isFunction(smaug.getAttributes);
  });

  it('should add client token', async() => {

    // Create mock function
    const _getClient = client.getClient;
    client.getClient = () => {
      return JSON.parse(smaugMock);
    };

    ctx.query.token = 'a40f3dd8-e426-4e49-b7df-f16a64a3b62f';
    await smaug.getAttributes(ctx, () => {});
    assert.deepEqual(ctx.session.state.client.app.clientId, 'a40f3dd8-e426-4e49-b7df-f16a64a3b62f');

    // Restore methods
    client.getClient = _getClient();
  });

  it('should validate token', async() => {
    ctx.session.state = {};
    ctx.query.token = 'invalid';
    ctx.query.returnUrl = 'some_url';
    await smaug.getAttributes(ctx, () => {});
    assert.isUndefined(ctx.session.state.client);
    assert.equal(ctx.status, 403);
  });
});
