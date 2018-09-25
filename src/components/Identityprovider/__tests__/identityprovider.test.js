import {assert} from 'chai';
import sinon from 'sinon';
import {authenticate, identityProviderCallback} from '../identityprovider.component';
import {createHash} from '../../../utils/hash.utils';
import {mockContext} from '../../../utils/test.util';
import moment from 'moment';
import {md5} from '../../../utils/hash.utils';
import {CONFIG} from '../../../utils/config.util';

describe('test authenticate method', () => {
  const next = () => {};
  let ctx;
  let sandbox;

  beforeEach(() => {
    ctx = mockContext();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should return content page', async() => {
    ctx.setState({
      serviceClient: {
        identityProviders: ['borchk', 'unilogin'],
        urls: {
          host: 'https://service_client_url'
        }
      }
    });
    ctx.render = sandbox.mock();
    await authenticate(ctx, ctx, next);
    assert.equal(ctx.status, 200);
    sandbox.restore();
  });

  it('Should render error page', async() => {
    const spy = sandbox.spy(ctx, 'render');
    ctx.setState({serviceClient: {identityProviders: ['invalid provider']}});
    assert.isFalse(spy.called);

    await authenticate(ctx, ctx, next);

    assert.isTrue(spy.called);
    assert.isString(spy.args[0][1].error);
    assert.isObject(spy.args[0][1].link);
  });
});

describe('test identityProviderCallback method', () => {
  let ctx;

  beforeEach(() => {
    ctx = mockContext('qwerty', 'some_url', {
      params: {},
      query: {
        id: 'testId'
      }
    });
    ctx.params.state = createHash(ctx.getState().stateHash);
  });

  const next = () => {
  };

  it('Should add unilogin user to context', async() => {
    ctx.params.type = 'unilogin';
    const user = 'test1234';
    const timestamp = moment().utc().format('YYYYMMDDHHmmss');
    const auth = md5(timestamp + CONFIG.unilogin.secret + user);
    ctx.query = {
      auth: auth,
      timestamp: timestamp,
      user: user
    };

    const expected = {
      userId: 'test1234',
      userType: 'unilogin',
      identityProviders: ['unilogin']
    };

    await identityProviderCallback(ctx, ctx, next);

    assert.deepEqual(ctx.getUser(), expected);
  });

  it('Should add nemlogin user and cpr to context', async() => {
    ctx.params.type = 'nemlogin';
    const expected = {
      userId: '0102030405',
      cpr: '0102030405',
      userType: 'nemlogin',
      identityProviders: ['nemlogin']
    };
    await identityProviderCallback(ctx, ctx, next);
    assert.deepEqual(ctx.getUser(), expected);
  });

  it('Should add borchk user to context', async() => {
    ctx.params.type = 'borchk';
    ctx.fakeBorchkPost = {userId: 'testId', pincode: 'testPincode', libraryId: '710100'};
    const expected = {
      userId: 'testId',
      cpr: null,
      userType: 'borchk',
      libraryId: '710100',
      pincode: 'testPincode',
      identityProviders: ['borchk'],
      userValidated: true
    };
    await identityProviderCallback(ctx, ctx, next);
    assert.deepEqual(ctx.getUser(), expected);
  });
});
