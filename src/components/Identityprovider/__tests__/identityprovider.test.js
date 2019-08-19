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

  beforeEach(() => {
    ctx = mockContext();
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
    await authenticate(ctx, ctx, next);
    expect(ctx.status).toEqual(200);
  });

  it('Should render error page', async () => {
    ctx.setState({serviceClient: {identityProviders: ['invalid provider']}});

    await authenticate(ctx, ctx, next);

    expect(ctx.render).toMatchSnapshot();
  });

  it('Should redirect to nemlogin', async () => {
    ctx.session.query.idp = 'nemlogin';
    await authenticate(ctx, ctx, next);
    expect(ctx.redirect).toBeCalledWith(
      `/login/identityProviderCallback/nemlogin/${
        ctx.session.state.stateHash[0]
      }`
    );
  });
  it('Should not redirect to nemlogin', async () => {
    ctx.session.client.identityProviders = ['borchk'];
    ctx.session.query.idp = 'nemlogin';
    await authenticate(ctx, ctx, next);
    expect(ctx.redirect).not.toBeCalled();
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
    ctx.params.state = ctx.getState().stateHash[0];
  });

  const next = () => {};

  it('Should add unilogin user to context', async () => {
    ctx.params.type = 'unilogin';
    const user = 'valid_user_id';
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
      userId: 'valid_user_id',
      uniloginId: 'valid_user_id',
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
      agency: '710100'
    };
    const expected = {
      userId: 'testId',
      cpr: null,
      userType: 'borchk',
      agency: '710100',
      pincode: 'testPincode',
      identityProviders: ['borchk'],
      userValidated: true
    };
    await identityProviderCallback(ctx, ctx, next);
    expect(ctx.getUser()).toEqual(expected);
  });
});
