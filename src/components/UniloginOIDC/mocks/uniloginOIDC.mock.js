/* eslint-disable max-len */
/**
 * @file
 * fra Stil https://viden.stil.dk/pages/viewpage.action?pageId=161059336#TilslutOIDC(Letv%C3%A6gtsl%C3%B8sning)-Eksempelp%C3%A5udfyldtmetadata:
 *
 */
const mocks = {
  codetokenidentityoidccodes: {access_token: 'someAccessToken', id_token: 'someIdToken'},
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

/**
 *
 * @param mock
 * @returns {{error: string}}
 */
export function uniloginOidcMock(mock) {
  return mocks[mock] ?? {error: 'unknown mock: ' + mock};
}

/**
 *
 * @param token
 * @returns {string}
 */
export function getMockedUniloginOidcUrl(token) {
  return `/login/identityProviderCallback/unilogin_oidc/${token}?session_state=someSessionState&code=someCode&state=someState`;
}

/**
 *
 * @returns {string}
 */
export function getMockedUniloginOidcLogoutUrl() {
  return '/logout';
}
