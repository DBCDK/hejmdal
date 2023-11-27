import {validateUniloginOidcTicket} from '../uniloginOIDC.component';
import {getAccessToken, getUserInfo} from '../uniloginOIDC.client';
import {mockContext} from '../../../utils/test.util.js';

describe('Unittesting methods in OIDC unilogin.client', () => {
  it('Should succesfully get an accessToken', async () => {
    const accessToken = await getAccessToken('state', 'code', 'token');
    expect(accessToken).toBe('someAccessToken');
  });
  it('Should succesfully get some userinfo', async () => {
    const accessToken = await getAccessToken('state', 'code', 'token');
    const userInfo = await getUserInfo(accessToken);
    expect(userInfo.sub).toBeDefined();
    expect(userInfo.sub).toBe('2a419de3-2a00-484e-8720-7dce792f49ef');
  });
});

describe('Unittesting methods in OIDC unilogin.component', () => {
  let ctx;

  it('Should succesfully get an accessToken', async () => {
    ctx = mockContext();
    ctx.query = {state: 'state', session_state: 'session_state', code: 'code'};
    ctx.setState({stateHash: 'token'});

    const userInfo = await validateUniloginOidcTicket(ctx);
    expect(userInfo.sub).toBeDefined();
    expect(userInfo.sub).toBe('2a419de3-2a00-484e-8720-7dce792f49ef');
  });
});
