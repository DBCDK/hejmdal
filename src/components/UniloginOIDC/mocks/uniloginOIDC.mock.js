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
    aktoer_gruppe: 'Elev',
    uniid: '1234567890',
    client_id: 'kenderjegikke',
    username: null,
    active: true
  },
  someElev: {
    exp: 1702541797,
    iat: 1702541497,
    auth_time: 1702541488,
    jti: '0075e63e-993a-4752-a689-ec3e1cb5e7ac',
    iss: 'https://et-broker.unilogin.dk/auth/realms/broker',
    sub: '2d14f224-f21f-4554-9f22-73b9e9975633',
    typ: 'Bearer',
    azp: 'kenderjegikke',
    nonce: '99d745ef637bfbf85398',
    session_state: '862a2bd6-200c-4d21-bab9-45f5966784a7',
    acr: '1',
    scope: 'openid',
    spec_ver: 'OIDC.3.0-UNILOGIN',
    'https://data:gov:dk/model/core/specVersion': 'OIDC.3.0-UNILOGIN',
    'dk:unilogin:aktoergruppe': 'Elev',
    'dk:unilogin:loa': 'EnFaktor',
    unilogin_loa: 'EnFaktor',
    'dk:gov:saml:attribute:AssuranceLevel': '2',
    'dk:unilogin:uniid': '1000000156',
    aktoer_gruppe: 'Elev',
    uniid: '1000000156',
    loa: '2',
    client_id: 'kenderjegikke',
    username: null,
    active: true
  },
  someMedarbejder: {
    exp: 1702542850,
    iat: 1702542550,
    auth_time: 1702542538,
    jti: '81fcdf3a-656d-4ecc-b657-fad660e63443',
    iss: 'https://et-broker.unilogin.dk/auth/realms/broker',
    sub: '154ace23-7d02-4c8e-a3b6-df1f206f3a9e',
    typ: 'Bearer',
    azp: 'kenderjegikke',
    nonce: '350ed60e6e1d704a07f8',
    session_state: '2db4053c-c83a-4af4-932b-a6fe1aab131c',
    acr: '1',
    scope: 'openid',
    spec_ver: 'OIDC.3.0-UNILOGIN',
    'https://data:gov:dk/model/core/specVersion': 'OIDC.3.0-UNILOGIN',
    'dk:unilogin:aktoergruppe': 'Medarbejder',
    'dk:unilogin:loa': 'EnFaktor',
    unilogin_loa: 'EnFaktor',
    'dk:gov:saml:attribute:AssuranceLevel': '2',
    'dk:unilogin:uniid': '1000000158',
    aktoer_gruppe: 'Medarbejder',
    uniid: '1000000158',
    loa: '2',
    client_id: 'kenderjegikke',
    username: null,
    active: true
  },
  someLaerer: {
    exp: 1702543093,
    iat: 1702542793,
    auth_time: 1702542785,
    jti: 'f57e57b8-b5ba-4773-97a6-0f674185af8f',
    iss: 'https://et-broker.unilogin.dk/auth/realms/broker',
    sub: '44236e2b-4b61-4781-b65d-16ba72bbc044',
    typ: 'Bearer',
    azp: 'kenderjegikke',
    nonce: '8b30d8319f4c2c4f890c',
    session_state: '88b53a35-c00c-411d-94f8-daa1508260a9',
    acr: '1',
    scope: 'openid',
    spec_ver: 'OIDC.3.0-UNILOGIN',
    'https://data:gov:dk/model/core/specVersion': 'OIDC.3.0-UNILOGIN',
    'dk:unilogin:aktoergruppe': 'Medarbejder',
    'dk:unilogin:loa': 'EnFaktor',
    unilogin_loa: 'EnFaktor',
    'dk:gov:saml:attribute:AssuranceLevel': '2',
    'dk:unilogin:uniid': '10000009e5',
    aktoer_gruppe: 'Medarbejder',
    uniid: '10000009e5',
    loa: '2',
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
