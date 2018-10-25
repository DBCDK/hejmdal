import sinon from 'sinon';
import {
  authenticate,
  identityProviderCallback
} from '../identityprovider.component';
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

  it('Should return content page', async () => {
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
    expect(ctx.status).toEqual(200);
    sandbox.restore();
  });

  it('Should render error page', async () => {
    const spy = sandbox.spy(ctx, 'render');
    ctx.setState({serviceClient: {identityProviders: ['invalid provider']}});
    expect(spy.called).toBe(false);

    await authenticate(ctx, ctx, next);

    expect(spy.called).toBe(true);
    expect(typeof spy.args[0][1].error).toBe('string');
    expect(typeof spy.args[0][1].link).toBe('object');
  });

  it('Should redirect to nemlogin', async () => {
    const spy = sandbox.spy(ctx, 'redirect');
    ctx.session.query.idp = 'nemlogin';
    await authenticate(ctx, ctx, next);
    expect(spy.called).toBe(true);
    expect(spy.args[0][0]).toEqual(
      '/login/identityProviderCallback/nemlogin/mock_state_value'
    );
  });
  it('Should not redirect to nemlogin', async () => {
    const spy = sandbox.spy(ctx, 'redirect');
    ctx.session.client.identityProviders = ['borchk'];
    ctx.session.query.idp = 'nemlogin';
    await authenticate(ctx, ctx, next);
    expect(spy.called).toBe(false);
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
    ctx.params.state = ctx.getState().stateHash;
  });

  const next = () => {};

  it('Should add unilogin user to context', async () => {
    ctx.params.type = 'unilogin';
    const user = 'test1234';
    const timestamp = moment()
      .utc()
      .format('YYYYMMDDHHmmss');
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

    expect(ctx.getUser()).toEqual(expected);
  });

  it('Should add nemlogin user and cpr to context', async () => {
    ctx.params.type = 'nemlogin';
    const expected = {
      userId: '0102030405',
      cpr: '0102030405',
      userType: 'nemlogin',
      identityProviders: ['nemlogin']
    };
    await identityProviderCallback(ctx, ctx, next);
    expect(ctx.getUser()).toEqual(expected);
  });

  it('Should add borchk user to context', async () => {
    ctx.params.type = 'borchk';
    ctx.fakeBorchkPost = {
      userId: 'testId',
      pincode: 'testPincode',
      libraryId: '710100'
    };
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
    expect(ctx.getUser()).toEqual(expected);
  });
});
