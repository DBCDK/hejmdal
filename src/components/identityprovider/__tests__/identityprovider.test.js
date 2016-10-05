import {assert} from 'chai';
import {authenticate, initialize, identityProviderCallback} from '../identityprovider.component';

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
    assert.include(ctx.body, 'id="borchk"');
    assert.notInclude(ctx.body, 'id="nemlogin"');
  });

  it('Should return error', () => {
    state.attributes.providers.push('invalid provider');
    const ctx = {state};
    authenticate(ctx, next);
    assert.equal(ctx.status, 404);
  });
});


describe('test identityProviderCallback method', () => {
  const ctx = {
    params: {
      type: 'test',
      token: 'e3ddad404e9ec232aa04787bc0080ca5'
    },
    query: {
      id: 'testId',
      somekey: 'somevalue'
    },
    state: {
      token: 'qwerty'
    }
  };
  const next = () => {
  };

  it('Should add unilogin user to context', () => {
    ctx.params.type = 'unilogin';
    const expected = {
      cpr: 'testId',
      type: 'unilogin',
      unilogin: 'uniloginId'
    };
    identityProviderCallback(ctx, next);
    assert.deepEqual(ctx.state.user, expected);
  });

  it('Should add nemlogin user to context', () => {
    ctx.params.type = 'nemlogin';
    const expected = {
      cpr: 'testId',
      type: 'nemlogin'
    };
    identityProviderCallback(ctx, next);
    assert.deepEqual(ctx.state.user, expected);
  });

  it('Should add library user to context', () => {
    ctx.params.type = 'borchk';
    const expected = {
      cpr: 'testId',
      type: 'borchk',
      libraryId: 'libraryId',
      pincode: 'pincode'
    };
    identityProviderCallback(ctx, next);
    assert.deepEqual(ctx.state.user, expected);
  });
});

describe('test initialize method', () => {
  it('Should add state to context', () => {
    const ctx = {};
    const next = () => {
    };
    initialize(ctx, next);
    assert.isDefined(ctx.state.user);
    assert.isObject(ctx.state.attributes);
  });
});

