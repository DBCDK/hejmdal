/* eslint-disable */

const sessionId = 'hejmdal-example-applications';

const defaultState = {
  authorizationURL: `${window.location.origin}/oauth/authorization`,
  tokenURL: `${window.location.origin}/oauth/token`,
  userinfoURL: `${window.location.origin}/userinfo/`,
  redirectUri: `${window.location.origin}/example`,
  path: `/login`,
  clientId: '',
  code: null,
  token: null,
  acces_token: null,
  user: null,
  presel: '',
  agency: '',
  agencyType: null,
  idp: '',
  state: '',
  loginUrl: ''
};

window.hejmdal = Object.assign(
  {},
  defaultState,
  JSON.parse(sessionStorage.getItem(sessionId)) || {}
);

/**
 * OnChange callback for inputfields
 */
window.onChange = function onChange({key, val}) {
  window.hejmdal[key] = val;
  setState();
};

/**
 * OnClick callback for Login-button
 */
window.login = function login() {
  window.location = hejmdal.loginUrl;
};

/**
 * OnClick callback for GetTicket-button
 */
window.getToken = function getToken() {
  const xhr = new XMLHttpRequest();
  const url = `${hejmdal.tokenURL}`;
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = () => {
    if (xhr.responseText.length) {
      const token = JSON.parse(xhr.responseText);
      hejmdal.token = token;
      if (token && token.access_token) {
        hejmdal.access_token = token.access_token;
      }
      setState();
    }
  };

  xhr.send(
    `grant_type=authorization_code&code=${hejmdal.code}&client_id=${
      hejmdal.clientId
    }&client_secret=secret&redirect_uri=${hejmdal.redirectUri}`
  );
};

/**
 * OnClick callback for getUserinfo-button
 */
window.getUserinfo = function getUserinfo() {
  const xhr = new XMLHttpRequest();
  const url = `${hejmdal.userinfoURL}`;
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Authorization', `Bearer ${hejmdal.access_token}`);
  xhr.onload = () => {
    if (xhr.responseText.length) {
      window.hejmdal.userinfo = JSON.parse(xhr.responseText);
      setState();
    }
  };

  xhr.send();
};

window.logout = function logout() {
  hejmdal = defaultState;
  setState();
  window.location = '/logout';
};

/**
 * Parses the URL for queries
 *
 * @return {{}}
 */
function parseQueryString() {
  const qObj = {};
  const queries = window.location.search.substring(1).split('&');
  queries.forEach(query => {
    const params = query.split('=');
    qObj[params[0]] = params[1];
  });

  return qObj;
}

function getAuthUrl({
  clientId,
  redirectUri,
  presel,
  agency,
  agencyType,
  idp,
  state
}) {
  let url = `${
    window.location.origin
  }/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  if (presel) {
    url += `&presel=${presel}`;
  }

  if (agency) {
    url += `&agency=${agency}`;
  }

  if (agencyType) {
    url += `&agencytype=${agencyType}`;
  }

  if (idp) {
    url += `&idp=${idp}`;
  }
  if (state) {
    url += `&state=${state}`;
  }

  return url;
}
function getTokenCUrl({tokenURL, redirectUri, code, clientId}) {
  return `curl -X POST ${tokenURL} -d "grant_type=authorization_code&code=${code}&client_id=${clientId}&client_secret=secret&redirect_uri=${redirectUri}"`;
}

function getUserinfoCUrl({userinfoURL, access_token}) {
  return `curl ${userinfoURL} -H "Authorization: Bearer ${access_token}"`;
}

function toString(value) {
  return typeof value !== 'string' ? JSON.stringify(value, null, '  ') : value;
}

function setActiveStep({code, access_token}) {
  const stepValue = access_token ? 'userinfo' : code ? 'code' : 'authorization';
  const steps = document.querySelectorAll('[data-step]');
  steps.forEach(step => {
    if (step.getAttribute('data-step') === stepValue) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });
  const hash = `#${stepValue}`;
  if (window.location.hash !== hash) {
    window.location = hash;
  }
}

function checkRequirements(state) {
  const elements = document.querySelectorAll('[data-requirement]');
  elements.forEach(element => {
    const requirement = element.getAttribute('data-requirement');
    if (state[requirement]) {
      element.classList.add('req-ok');
    } else {
      element.classList.remove('req-ok');
    }
  });
}
function updateBindings(state) {
  const elements = document.querySelectorAll('[data-bind]');
  elements.forEach(element => {
    const requirement = element.getAttribute('data-bind');
    if (state[requirement]) {
      if (typeof element.value !== 'undefined') {
        element.value = toString(state[requirement]);
      } else {
        element.textContent = toString(state[requirement]);
      }
    }
  });
}

/**
 * Updates the UI based on the current state
 */
function setState() {
  hejmdal.loginUrl = getAuthUrl(hejmdal);
  hejmdal.tokenCUrl = getTokenCUrl(hejmdal);
  hejmdal.userinfoCUrl = getUserinfoCUrl(hejmdal);

  updateBindings(hejmdal);
  checkRequirements(hejmdal);
  setActiveStep(hejmdal);

  sessionStorage.setItem(sessionId, JSON.stringify(hejmdal));
}

/**
 * Init method called by the end of HTML rendering
 */
(function init() {
  const queryObj = parseQueryString();
  if (queryObj.code) {
    if (hejmdal.code !== queryObj.code) {
      hejmdal.access_token = null;
      hejmdal.token = null;
      hejmdal.userinfo = null;
      hejmdal.code = queryObj.code;
      hejmdal.state = queryObj.state || '';
    }
  } else {
    hejmdal.initialized = true;
    hejmdal.code = false;
    hejmdal.state = '';
  }

  setState();
})();
