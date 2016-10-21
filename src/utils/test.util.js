import {setDefaultState, stateMiddleware} from '../middlewares/state.middleware';

/**
 * create mock context for tests
 *
 * @returns {{}}
 */
export function mockContext(token = 'qwerty', returnurl='some_url', overrides = {}) {
  const ctx = {
    query: {token, returnurl},
    session: {}
  };
  setDefaultState(ctx, () => {});
  stateMiddleware(ctx, () => {});
  Object.keys(overrides).forEach(key => {
    ctx[key] = Object.assign(ctx[key] || {}, overrides[key]);
  });
  return ctx;
}
