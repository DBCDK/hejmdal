import {assert} from 'chai';
import {stateMiddleware, setDefaultState} from '../state.middleware';

describe('stateMiddleware tests', () => {
  it('should add functions to ctx', () => {
    const ctx = {};
    stateMiddleware(ctx, () => {});
    assert.isFunction(ctx.setState);
    assert.isFunction(ctx.getState);
    assert.isFunction(ctx.setUser);
    assert.isFunction(ctx.getUser);
  });

  it('should update state', () => {
    const ctx = {
      session: {}
    };
    const newState = {test: 'some value'};
    stateMiddleware(ctx, () => {});
    ctx.setState(newState);
    assert.deepEqual(ctx.session.state, newState);
    assert.deepEqual(ctx.getState(), newState);
  });

  it('should only update added attributes', () => {
    const ctx = {
      session: {
        state: {old: 'value'}
      }
    };
    const newState = {test: 'some value'};
    stateMiddleware(ctx, () => {});
    ctx.setState(newState);
    assert.deepEqual(ctx.session.state.old, 'value');
    assert.deepEqual(ctx.getState().old, 'value');
    assert.deepEqual(ctx.getState().test, 'some value');
  });

  it('should update user', () => {
    const ctx = {
      session: {}
    };
    const newState = {test: 'some value', userType: 'testType'};
    stateMiddleware(ctx, () => {});
    ctx.setUser(newState);
    assert.deepEqual(ctx.getUser(), Object.assign(newState, {identityProviders: ['testType']}));
  });

  it('should set a default state', () => {
    const ctx = {
      session: {},
      query: {
        returnurl: 'some_url'
      }
    };
    setDefaultState(ctx, () => {});
    assert.deepEqual(ctx.session.user, {});
    assert.isDefined(ctx.session.state.consents);
    assert.equal(ctx.session.state.returnUrl, 'some_url');
  });
});
