/* eslint-disable */
window.hejmdal = {
  host: `${window.location.origin}`,
  path: `/login`,
  token: '',
  tickettoken: null,
  ticketid: null,
  ticket: null,
  presel: '',
  agency: '',
  agencytype: null,
};

const queryObj = parseQueryString();

/**
 * OnChange callback for inputfields
 */
function onChange({key, val}) {
  console.log(key, val);
  window.hejmdal[key] = val;
  setState();
}

/**
 * OnClick callback for Login-button
 */
function onClick() {
  window.location = document.getElementById('currenturl').textContent;
}

/**
 * OnClick callback for GetTicket-button
 */
function getTicket() {
  const xhr = new XMLHttpRequest();
  const url = document.getElementById('ticketurl').innerHTML;
  xhr.open('GET', url, true);
  xhr.onreadystatechange = () => {
    if (xhr.statusText === 'OK' && xhr.status === 200 && xhr.responseText.length) {
      window.hejmdal.ticket = xhr.responseText;
      setState();
    }
  };

  xhr.send();
}

function openTicket() {
  const url = document.getElementById('ticketurl').innerHTML;
  window.open(url, '_blank');
}

function resetToDefault() {
  window.location = `${window.hejmdal.host}/logout?returnurl=/example/`;
}

/**
 * Parses the URL for queries
 *
 * @return {{}}
 */
function parseQueryString() {
  const qObj = {};
  const queries = window.location.search.substring(1).split('&');
  queries.forEach((query) => {
    const params = query.split('=');
    qObj[params[0]] = params[1];
  });

  return qObj;
}

/**
 * Updates the UI based on the current state
 */
function setState() {
  document.getElementById('input-login-host').value = window.hejmdal.host;
  document.getElementById('input-login-path').value = window.hejmdal.path;
  document.getElementById('input-login-token').value = window.hejmdal.token;
  document.getElementById('input-preselected-library').value = window.hejmdal.presel;
  document.getElementById('input-locked-library').value = window.hejmdal.agency;

  let url = `${window.hejmdal.host}${window.hejmdal.path}?token=${window.hejmdal.token}`;
  if(window.hejmdal.presel.length >= 1){
    url += `&presel=${window.hejmdal.presel}`;
  }

  if(window.hejmdal.agency.length >= 1){
    url += `&agency=${window.hejmdal.agency}`;
  }

  if(window.hejmdal.agencytype){
    url += `&agencytype=${window.hejmdal.agencytype}`;
  }

  document.getElementById('currenturl').textContent = url;

  document.getElementById('tickettoken').innerHTML = window.hejmdal.tickettoken || '&nbsp;';
  document.getElementById('ticketid').innerHTML = window.hejmdal.ticketid || '&nbsp;';
  document.getElementById('post-success').className = window.hejmdal.tickettoken ? '' : 'hide';
  document.getElementById('ticketurl').innerHTML = window.hejmdal.tickettoken ?
    `${window.hejmdal.host}/getTicket/${window.hejmdal.tickettoken}/${window.hejmdal.ticketid}` :
    '&nbsp;';

  // Ticket
  if (window.hejmdal.ticket) {
    if (typeof window.hejmdal.ticket === 'string') {
      window.hejmdal.ticket = JSON.parse(window.hejmdal.ticket);
    }
    document.getElementById('ticketcontainer').classList.remove('hide');
  }

  document.getElementById('ticket').textContent = JSON.stringify(window.hejmdal.ticket, null, '  ') || '&nbsp;';
}

/**
 * Init method called by the end of HTML rendering
 */
function init() {
  if (queryObj.token) {
    window.hejmdal.tickettoken = queryObj.token;
    window.hejmdal.ticketid = queryObj.id;
  }

  setState();
}
