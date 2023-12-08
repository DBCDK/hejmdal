import {validateUniloginOidcTicket} from '../uniloginOIDC.component';
import {getOidcTokens, getUserInfo} from '../uniloginOIDC.client';
import {mockContext} from '../../../utils/test.util.js';

describe('Unittesting methods in OIDC unilogin.client', () => {
  it('Should succesfully get an accessToken', async () => {
    const {access_token, id_token} = await getOidcTokens('code', 'token', {id: 'identity', secret: 'xx'}, {code_verifier: 'oidccodes'});
    expect(access_token).toBe('someAccessToken');
    expect(id_token).toBe('someIdToken');
  });
  it('Should succesfully get some userinfo', async () => {
    const {access_token} = await getOidcTokens('code', 'token', {id: 'identity', secret: 'xx'}, {code_verifier: 'oidccodes'});
    const userInfo = await getUserInfo(access_token);
    expect(userInfo.sub).toBeDefined();
    expect(userInfo.sub).toBe('2a419de3-2a00-484e-8720-7dce792f49ef');
  });
});

describe('Unittesting methods in OIDC unilogin.component', () => {
  let ctx;

  it('Should succesfully get an access_token', async () => {
    ctx = mockContext();
    ctx.query = {code: 'code'};
    ctx.setUser({uniloginOidcCodes: {code_verifier: 'oidccodes'}});
    ctx.setState({stateHash: 'token', serviceClient: {idpIdentity: {unilogin: {id: 'identity', secret: 'xx'}}}});

    const userInfo = await validateUniloginOidcTicket(ctx);
    expect(userInfo.sub).toBeDefined();
    expect(userInfo.sub).toBe('2a419de3-2a00-484e-8720-7dce792f49ef');
  });
});
