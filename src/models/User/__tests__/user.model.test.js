import {assert} from 'chai';
import sinon from 'sinon';
import Store from '../user.persistent.storage.model';

import Knex from 'knex';
import {Model} from 'objection';

// Utils
import {CONFIG} from '../../../utils/config.util';

// Initialize knex.
const knex = Knex(CONFIG.postgres);
Model.knex(knex);

describe('User store tests', () => {
  let sandbox;
  let store;

  beforeEach(() => {
    store = new Store();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should upsert user', async () => {
    const user = {
      userId: '1122334455'
    };
    const res = await store.insert(user);
    assert.isTrue(res > 0);
  });

  it('should get user', async () => {
    const user = {
      userId: '1122334455'
    };
    await store.update(user.userId, user);
    const userFromDb = await store.read(user.userId);
    assert.deepEqual(user, userFromDb);
  });

  it('should delete user', async () => {
    const user = {
      userId: '1122334455'
    };
    const res = await store.insert(user);
    assert.isTrue(res > 0);
    await store.delete(user.userId);
    const userFromDb = await store.read(user.userId);
    assert.isNull(userFromDb);
  });
});
