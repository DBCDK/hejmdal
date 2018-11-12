import {CONFIG} from '../../../utils/config.util';
import {logout} from '../logout.component';
import {mockContext} from '../../../utils/test.util';
import {mockData} from '../../Smaug/mock/smaug.client.mock';

describe('Test Logout component', () => {
  // Contains the context object
  let ctx;

  beforeEach(() => {
    CONFIG.mock_externals.smaug = true;
    ctx = mockContext(CONFIG.test.token);
    ctx.redirect = jest.fn();
  });

  afterEach(() => {
    mockData.logoutScreen = 'include';
  });

  it('should export functions', () => {
    expect(typeof logout).toBe('function');
  });

  it('should render generic logout screen', async () => {
    ctx = mockContext();
    await logout(ctx, ctx, jest.fn());

    expect(ctx.render).toBeCalledWith('Logout', {
      idpLogoutInfo: false,
      returnurl: '',
      serviceName: null
    });
  });

  it('should render returnurl and name for serviceclient', async () => {
    await logout(ctx, ctx, () => {});
    expect(ctx.render).toBeCalledWith('Logout', {
      idpLogoutInfo: null,
      returnurl: 'http://localhost:3011/example/',
      serviceName: 'Test Service'
    });
  });

  it('should render idp message', async () => {
    ctx.session.user.identityProviders = ['unilogin'];
    await logout(ctx, ctx, () => {});
    expect(ctx.render).toBeCalledWith('Logout', {
      idpLogoutInfo: true,
      returnurl: 'http://localhost:3011/example/',
      serviceName: 'Test Service'
    });
  });

  it('should redirect to returnurl', async () => {
    mockData.logoutScreen = 'skip';
    await logout(ctx, ctx, () => {});
    expect(ctx.redirect).toBeCalledWith(
      'http://localhost:3011/example/?message=logout'
    );
  });
  it('should redirect to returnurl with close browser message', async () => {
    ctx.session.user.identityProviders = ['unilogin'];
    mockData.logoutScreen = 'skip';
    await logout(ctx, ctx, () => {});
    expect(ctx.redirect).toBeCalledWith(
      'http://localhost:3011/example/?message=logout_close_browser'
    );
  });
});
