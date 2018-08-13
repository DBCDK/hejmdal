import {assert} from 'chai';
import {CONFIG} from '../../../utils/config.util';
import {logout} from '../logout.component';
import {mockContext} from '../../../utils/test.util';
import sinon from 'sinon';
import {mockData} from '../../Smaug/mock/smaug.client.mock';

describe('Test Logout component', () => {

  // Contains the context object
  let ctx;

  beforeEach(() => {
    CONFIG.mock_externals.smaug = true;
    ctx = mockContext(CONFIG.test.token);
  });

  afterEach(() => {
    mockData.logoutScreen = 'include';
  });


  it('should export functions', () => {
    assert.isFunction(logout);
  });

  it('should render generic logout screen', async () => {
    ctx = mockContext();
    ctx.render = sinon.spy();
    await logout(ctx, () => {});
    assert.deepEqual(ctx.render.args[0][1], {
      idpLogoutInfo: false,
      returnurl: '',
      serviceName: null
    });
  });

  it('should render returnurl and name for serviceclient', async () => {
    ctx.render = sinon.spy();
    await logout(ctx, () => {});
    assert.deepEqual(ctx.render.args[0][1], {
      idpLogoutInfo: null,
      returnurl: 'http://localhost:3011/some_url',
      serviceName: 'Test Service'
    });
  });

  it('should render idp message', async () => {
    ctx.session.user.identityProviders = ['unilogin'];
    ctx.render = sinon.spy();
    await logout(ctx, () => {});
    assert.deepEqual(ctx.render.args[0][1], {
      idpLogoutInfo: true,
      returnurl: 'http://localhost:3011/some_url',
      serviceName: 'Test Service'
    });
  });

  it('should redirect to returnurl', async () => {
    mockData.logoutScreen = 'skip';
    ctx.render = sinon.spy();
    ctx.redirect = sinon.spy();
    await logout(ctx, () => {});
    assert.deepEqual(ctx.redirect.args[0][0], 'http://localhost:3011/some_url?message=logout');
  });
  it('should redirect to returnurl with close browser message', async () => {
    ctx.session.user.identityProviders = ['unilogin'];
    mockData.logoutScreen = 'skip';
    ctx.render = sinon.spy();
    ctx.redirect = sinon.spy();
    await logout(ctx, () => {});
    assert.deepEqual(ctx.redirect.args[0][0], 'http://localhost:3011/some_url?message=logout_close_browser');
  });
});
