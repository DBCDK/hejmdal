/* eslint-disable max-len */
/**
 * @file
 * fra Stil https://viden.stil.dk/pages/viewpage.action?pageId=161059336#TilslutOIDC(Letv%C3%A6gtsl%C3%B8sning)-Eksempelp%C3%A5udfyldtmetadata:
 *
 * @type {{statecodetoken: string, someAccessToken: {sub: string, iss: string, active: boolean, typ: string, nonce: string, client_id: string, acr: string, azp: string, auth_time: number, scope: string, exp: number, session_state: string, iat: number, jti: string, username: null}}}
 */
const mocks = {
  statecodetoken: 'someAccessToken',
  someAccessToken: {
    exp: 1700719599, //
    iat: 1700719299,
    auth_time: 1700719289,
    jti: '0ff05083-eb71-409c-a4d1-28f974141652',
    iss: 'https://et-broker.unilogin.dk/auth/realms/broker',
    sub: '2a419de3-2a00-484e-8720-7dce792f49ef',
    typ: 'Bearer',
    azp: 'kenderjegikke',
    nonce: '549ee6716903edf900ee',
    session_state: 'fa07b11c-82dd-4f35-a745-417dfcb0f1b3',
    acr: '1',
    scope: 'openid',
    client_id: 'kenderjegikke',
    username: null,
    active: true
  }
};

export function uniloginOidcMock(mock) {
  return mocks[mock] ?? {error: 'unknown mock: ' + mock};
}
