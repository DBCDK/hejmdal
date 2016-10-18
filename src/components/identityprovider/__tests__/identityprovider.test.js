import {assert} from 'chai';
import {authenticate, identityProviderCallback} from '../identityprovider.component';
import {createHash} from '../../../utils/hash.utils';

describe('test authenticate method', () => {
  const state = {
    user: null,
    client: {
      identityProviders: ['borchk', 'unilogin']
    },
    token: 'qwerty'
  };

  const next = () => {
  };

  it('Should return content page', () => {
    const ctx = {session: {state}};
    authenticate(ctx, next);
    assert.equal(ctx.status, 200);
    assert.include(ctx.body, 'id="borchk"');
    assert.notInclude(ctx.body, 'id="nemlogin"');
  });

  it('Should return error', () => {
    state.client.identityProviders.push('invalid provider');
    const ctx = {session: {state}};
    authenticate(ctx, next);
    assert.equal(ctx.status, 404);
  });
});

describe('test identityProviderCallback method', () => {
  const ctx = {
    params: {
      type: 'test',
      token: '...depending.on.secret...'
    },
    query: {
      id: 'testId',
      somekey: 'somevalue'
    },
    session: {
      state: {
        token: 'qwerty'
      }
    }
  };
  ctx.params.token = createHash(ctx.session.state.token);
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
    assert.deepEqual(ctx.session.state.user, expected);
  });

  it('Should add nemlogin user to context', () => {
    ctx.params.type = 'nemlogin';
    const expected = {
      cpr: 'testId',
      type: 'nemlogin'
    };
    identityProviderCallback(ctx, next);
    assert.deepEqual(ctx.session.state.user, expected);
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
    assert.deepEqual(ctx.session.state.user, expected);
  });
});
