import {CONFIG} from '../../../utils/config.util';
import {logout, validateToken} from '../logout.component';
import {mockContext} from '../../../utils/test.util';
import {mockData} from '../../Smaug/mock/smaug.client.mock';

describe('Test Logout component', () => {
  // Contains the context object
  let ctx;

  beforeEach(async () => {
    CONFIG.mock_externals.smaug = true;
    ctx = mockContext(CONFIG.test.token);
    ctx.query.access_token = CONFIG.test.token;
    await validateToken(ctx, ctx, jest.fn());
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
    ctx.query = {};
    await validateToken(ctx, ctx, jest.fn());
    await logout(ctx, ctx, jest.fn());

    expect(ctx.render).toBeCalledWith('Logout', {
      returnurl: null,
      serviceName: ''
    });
  });

  it('should render returnurl and name for serviceclient', async () => {
    await logout(ctx, ctx, () => {});
    expect(ctx.render).toBeCalledWith('Logout', {
      returnurl: 'http://localhost:3011/example/',
      serviceName: 'Test Service'
    });
  });

  it('should render idp message', async () => {
    ctx.session.user.identityProviders = ['unilogin'];
    await logout(ctx, ctx, () => {});
    expect(ctx.render).toBeCalledWith('Logout', {
      returnurl: 'http://localhost:3011/example/',
      serviceName: 'Test Service'
    });
  });

  it('should redirect to returnurl', async () => {
    mockData.logoutScreen = 'skip';
    ctx.session.state.redirect_uri = 'http://localhost:3011/example/';
    await logout(ctx, ctx, () => {});
    expect(ctx.redirect).toBeCalledWith(
      'http://localhost:3011/example/?message=logout'
    );
  });

  it('should redirect to returnurl with single query parameter', async () => {
    mockData.logoutScreen = 'skip';
    ctx.session.state.redirect_uri = 'http://localhost:3011/example/?q=hest';
    await logout(ctx, ctx, () => {});
    expect(ctx.redirect).toBeCalledWith(
      'http://localhost:3011/example/?q=hest&message=logout'
    );
  });

  // This test is not really representative of what happens in a real browser.
  // The browser will cut off anything after ?q=hest so in a real browser environment
  // the expected answer would be: http://localhost:3011/example/?q=hest&message=logout
  it('should redirect to returnurl with multiple non-url encoded query parameters', async () => {
    mockData.logoutScreen = 'skip';
    ctx.session.state.redirect_uri = 'http://localhost:3011/example/?q=hest&qp1=val1&qp2=val2';
    await logout(ctx, ctx, () => {});
    expect(ctx.redirect).toBeCalledWith(
      'http://localhost:3011/example/?q=hest&qp1=val1&qp2=val2&message=logout'
    );
  });

  it('should redirect to returnurl with multiple url encoded query parameters', async () => {
    mockData.logoutScreen = 'skip';
    ctx.session.state.redirect_uri = 'http://localhost:3011/example/?q%3Dhest%26qp1%3Dval1%26qp2%3Dval2';
    await logout(ctx, ctx, () => {});
    expect(ctx.redirect).toBeCalledWith(
      'http://localhost:3011/example/?q=hest&qp1=val1&qp2=val2&message=logout'
    );
  });

  it('should redirect to returnurl with close browser message', async () => {
    ctx.session.user.identityProviders = ['unilogin'];
    ctx.session.state.redirect_uri = 'http://localhost:3011/example/';
    mockData.logoutScreen = 'skip';
    await logout(ctx, ctx, () => {});
    expect(ctx.redirect).toBeCalledWith(
      'http://localhost:3011/example/?message=logout_close_browser'
    );
  });
});
