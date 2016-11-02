import {assert} from 'chai';
import {authenticate, identityProviderCallback} from '../identityprovider.component';
import {createHash} from '../../../utils/hash.utils';
import {mockContext} from '../../../utils/test.util';

describe('test authenticate method', () => {
  const next = () => {
  };
  const ctx = mockContext();

  it('Should return content page', () => {
    ctx.setState({serviceClient: {identityProviders: ['borchk', 'unilogin']}});
    authenticate(ctx, next);
    assert.equal(ctx.status, 200);
    assert.include(ctx.body, 'id="borchk"');
    assert.notInclude(ctx.body, 'id="nemlogin"');
  });

  it('Should return error', () => {
    ctx.setState({serviceClient: {identityProviders: ['invalid provider']}});
    authenticate(ctx, next);
    assert.equal(ctx.status, 404);
  });
});

describe('test identityProviderCallback method', () => {
  const ctx = mockContext('qwerty', 'some_url', {
    params: {},
    query: {
      id: 'testId'
    }
  });
  ctx.params.token = createHash(ctx.getState().smaugToken);
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
    assert.deepEqual(ctx.getUser(), expected);
  });

  it('Should add nemlogin user to context', async () => {
    ctx.params.type = 'nemlogin';
    const expected = {
      userId: '0102030405',
      userType: 'nemlogin',
      identityProviders: ['nemlogin']
    };
    await identityProviderCallback(ctx, next);
    assert.deepEqual(ctx.getUser(), expected);
  });

/*  How to set post parameters in test */
  it('Should add borchk user to context', async () => {
    ctx.params.type = 'borchk';
    ctx.fakeBorchkPost= {userId: 'testId', pincode: 'testPincode', libraryId: '710100'};
    const expected = {
      userId: 'testId',
      userType: 'borchk',
      libraryId: '710100',
      pincode: 'testPincode',
      identityProviders: ['borchk'],
      userValidated: true
    };
    await identityProviderCallback(ctx, next);
    assert.deepEqual(ctx.getUser(), expected);
  });
});
