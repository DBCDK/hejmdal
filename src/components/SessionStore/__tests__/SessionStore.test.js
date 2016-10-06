/**
 * @file
 * Testing the SessionStore class
 */

import {assert} from 'chai';
import SessionStore from '../SessionStore.component';

describe('Testing the SessionStore class', () => {
  let store;

  beforeEach(() => {
    store = new SessionStore();
  });

  afterEach(() => {
    store = null;
  });

  it('It should return sid', () => {
    const newSession = {test: 'hest'};
    const res = store.set(newSession, {});

    return res.then((sid) => {
      assert.isString(sid)
    });
  });

  it('It should store the session object in the session store', () => {
    const newSession = {test: 'hest'};
    const res = store.set(newSession, {});

    return res.then((sid) => {
      const content = store.Store.get(sid);
      assert.isDefined(content);
      assert.isObject(content);
    });
  });

  it('It should return undefined when no matching session matching given sid is found', () => {
    const sid = 'unknown-sid';
    const content = store.Store.get(sid);
    assert.isUndefined(content);
  });

  it('It should return session object when given a sid', () => {
    const newSession = {test: 'hest'};
    const res = store.set(newSession, {});

    return res.then((sid) => {
      return store.get(sid).then((session) => {
        const oldSession = Object.assign({}, session);
        assert.deepEqual(oldSession, newSession);
      });
    });
  });

  it('It should destroy the session matching the given sid', () => {
    const session = {test: 'hest'};
    const res = store.set(session, {});

    return res.then((sid) => {
      store.destroy(sid);
      assert.isUndefined(store.Store.get(sid));
    });
  });
});
