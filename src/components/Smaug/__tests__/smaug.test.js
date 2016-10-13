import {assert} from 'chai';
import * as smaug from '../smaug.component';

describe('Test smaug component', () => {
  const ctx = {
    state: {},
    query: {
      token: null
    }
  };
  it('should export functions', () => {
    assert.isFunction(smaug.getAttributes);
  });

  it('should add client token', async () => {
    ctx.query.token = 'qwerty';
    await smaug.getAttributes(ctx, () => {});
    assert.isUndefined(ctx.redirect);
    assert.deepEqual(ctx.state.client.id, 'abcde-12345');
  });

  it('should validate token', async () => {
    ctx.query.token = 'invalid';
    ctx.query.returnUrl = 'some_url';
    await smaug.getAttributes(ctx, () => {});
    assert.equal(ctx.redirect, ctx.query.returnUrl);
  });
});
