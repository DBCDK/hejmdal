import {
  authenticate,
  identityProviderCallback,
  trimPossibleCpr
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
    ctx.status = jest.fn();
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
    expect(ctx.status).toBeCalledWith(200);
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
      `/login/identityProviderCallback/nemlogin/${ctx.session.state.stateHash}`
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
    ctx.params.state = ctx.getState().stateHash;
  });

  const next = () => {};

  it('Should add unilogin user to context', async () => {
    ctx.params.type = 'unilogin';
    const user = 'valid_user_id';
    const timestamp = moment().utc().format('YYYYMMDDHHmmss');
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
      identityProviders: ['unilogin'],
      ips: ['127.0.0.1']
    };

    await identityProviderCallback(ctx, ctx, next);

    expect(ctx.getUser()).toEqual(expected);
  });

  it('Should add nemlogin user to context', async () => {
    ctx.params.type = 'nemlogin';
    const expected = {
      userId: '0102031111',
      agency: '790900',
      cpr: '0102031111',
      userType: 'nemlogin',
      identityProviders: ['nemlogin'],
      ips: ['127.0.0.1']
    };
    await identityProviderCallback(ctx, ctx, next);
    expect(ctx.getUser()).toEqual(expected);
  });

  it('Should add borchk user to context', async () => {
    ctx.params.type = 'borchk';
    ctx.fakeBorchkPost = {
      loginBibDkUserId: 'testId',
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
      ips: ['127.0.0.1'],
      userValidated: true
    };
    await identityProviderCallback(ctx, ctx, next);
    expect(ctx.getUser()).toEqual(expected);
  });

  it('Should normalize cpr with -', async () => {
    expect(trimPossibleCpr('123456-1234')).toEqual('123456-1234');
    expect(trimPossibleCpr('121212-123')).toEqual('121212-123');
    expect(trimPossibleCpr('121212-1234')).toEqual('1212121234');
    expect(trimPossibleCpr('12 12 12-1234')).toEqual('1212121234');
  });
});
