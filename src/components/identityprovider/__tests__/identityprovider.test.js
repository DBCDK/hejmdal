import {assert} from 'chai';
import {authenticate, identityProviderCallback} from '../identityprovider.component';
import {createHash} from '../../../utils/hash.utils';

describe('test authenticate method', () => {
  const state = {
    serviceClient: {
      attributes: [],
      identityProviders: ['borchk', 'unilogin'],
      id: 'test'
    },
    smaugToken: 'qwerty'
  };

  const next = () => {
  };

  it('Should return content page', () => {
    const ctx = {session: {state, user: {}}};
    authenticate(ctx, next);
    assert.equal(ctx.status, 200);
    assert.include(ctx.body, 'id="borchk"');
    assert.notInclude(ctx.body, 'id="nemlogin"');
  });

  it('Should return error', () => {
    state.serviceClient.identityProviders.push('invalid provider');
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
      user: {},
      state: {
        smaugToken: 'qwerty'
      }
    }
  };
  ctx.params.token = createHash(ctx.session.state.smaugToken);
  const next = () => {
  };

  it('Should add unilogin user to context', () => {
    ctx.params.type = 'unilogin';
    const expected = {
      userId: 'testId',
      userType: 'unilogin',
      identityProviders: ['unilogin']
    };
    identityProviderCallback(ctx, next);
    assert.deepEqual(ctx.session.user, expected);
  });

  it('Should add nemlogin user to context', () => {
    ctx.params.type = 'nemlogin';
    const expected = {
      userId: 'testId',
      userType: 'nemlogin',
      identityProviders: ['nemlogin']
    };
    identityProviderCallback(ctx, next);
    assert.deepEqual(ctx.session.user, expected);
  });

  it('Should add library user to context', () => {
    ctx.params.type = 'borchk';
    const expected = {
      userId: 'testId',
      userType: 'borchk',
      libraryId: 'libraryId',
      pincode: 'pincode',
      identityProviders: ['borchk']
    };
    identityProviderCallback(ctx, next);
    assert.deepEqual(ctx.session.user, expected);
  });
});
