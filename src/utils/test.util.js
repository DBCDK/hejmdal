import {
  setDefaultState,
  stateMiddleware
} from '../middlewares/state.middleware';
import {mockData} from '../components/Smaug/mock/smaug.client.mock';
import {CONFIG} from './config.util';

const stores = [];

/**
 * Create mock context for tests.
 *
 * Works as either an express request or response.
 *
 * @returns {{}}
 */
export function mockContext(
  token = 'qwerty',
  returnurl = 'some_url',
  overrides = {}
) {
  const ctx = {
    query: {token, returnurl},
    session: {
      save: cb => cb(),
      destroy: cb => cb && cb(),
      client: Object.assign({}, mockData),
      query: {
        state: 'mock_state_value'
      }
    },
    render: jest.fn(),
    send: jest.fn(),
    redirect: jest.fn()
  };
  setDefaultState(ctx, ctx, () => {});
  stateMiddleware(ctx, ctx, () => {});
  Object.keys(overrides).forEach(key => {
    ctx[key] = Object.assign(ctx[key] || {}, overrides[key]);
  });

  return ctx;
}

export function registerStore(store) {
  if (CONFIG.app.env === 'test') {
    stores.push(store);
  }
}

/**
 * For test purpose only!
 * Request alle memory stores to be wiped.
 */
export function wipeStores() {
  if (CONFIG.app.env === 'test') {
    stores.forEach(store => {
      store.wipeout();
    });
  }
}
