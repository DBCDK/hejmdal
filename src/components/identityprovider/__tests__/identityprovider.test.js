import {assert} from 'chai';
import {authenticate, initialize, callback} from '../identityprovider.component';

describe('test authenticate method', () => {
  const state = {
    user: null,
    attributes: {
      providers: ['borchk', 'unilogin']
    }
  };
  const next = () => {
  };
  it('Should return content page', () => {
    const ctx = {state};
    authenticate(ctx, next);
    assert.equal(ctx.status, 200);
    assert.include(ctx.body, 'id="borchk"')
    assert.notInclude(ctx.body, 'id="nemlogin"')
  });

  it('Should return error', () => {
    state.attributes.providers.push('invalid provider');
    const ctx = {state};
    authenticate(ctx, next);
    assert.equal(ctx.status, 404);
  });
});


describe('test callback method', () => {
  const ctx = {
    params: {
      type: 'test'
    },
    query: {
      id: 'testId',
      somekey: 'somevalue'
    },
    state: {}
  };
  const next = () => {
  };

  it('Should add user to context', () => {
    const expected = {
      user: {
        id: 'testId',
        type: 'test',
        query: {
          id: 'testId',
          somekey: 'somevalue'
        },
      }
    };
    callback(ctx, next);
    assert.deepEqual(ctx.state, expected);
  });
});

describe('test initialize method', () => {
  it('Should add state to context', () => {
    const ctx = {};
    const next = () => {};
    initialize(ctx, next);
    assert.isDefined(ctx.state.user);
    assert.isObject(ctx.state.attributes);
  });
});

