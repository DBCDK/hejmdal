import {stateMiddleware, setDefaultState} from '../state.middleware';

describe('stateMiddleware tests', () => {
  it('should add functions to ctx', () => {
    const ctx = {};
    stateMiddleware(ctx, ctx, () => {});
    expect(typeof ctx.setState).toBe('function');
    expect(typeof ctx.getState).toBe('function');
    expect(typeof ctx.setUser).toBe('function');
    expect(typeof ctx.getUser).toBe('function');
  });

  it('should update state', () => {
    const ctx = {
      session: {}
    };
    const newState = {test: 'some value'};
    stateMiddleware(ctx, ctx, () => {});
    ctx.setState(newState);
    expect(ctx.session.state).toEqual(newState);
    expect(ctx.getState()).toEqual(newState);
  });

  it('should only update added attributes', () => {
    const ctx = {
      session: {
        state: {old: 'value'}
      }
    };
    const newState = {test: 'some value'};
    stateMiddleware(ctx, ctx, () => {});
    ctx.setState(newState);
    expect(ctx.session.state.old).toEqual('value');
    expect(ctx.getState().old).toEqual('value');
    expect(ctx.getState().test).toEqual('some value');
  });

  it('should update user', () => {
    const ctx = {
      session: {}
    };
    const newState = {test: 'some value', userType: 'testType'};
    stateMiddleware(ctx, ctx, () => {});
    ctx.setUser(newState);
    expect(ctx.getUser()).toEqual(
      Object.assign(newState, {identityProviders: ['testType']})
    );
  });

  it('should set a default state', () => {
    const ctx = {
      session: {},
      query: {
        return_url: 'some_url'
      }
    };
    setDefaultState(ctx, ctx, () => {});
    expect(ctx.session.user).toEqual({});
    expect(ctx.session.state.consents).toBeDefined();
    expect(ctx.session.state.returnUrl).toEqual('some_url');
  });
});
