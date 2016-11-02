window.hejmdal = {
  host: 'http://localhost:3010/v0',
  token: 'valid_token',
  tickettoken: null,
  ticketid: null,
  ticket: null,
};

const queryObj = parseQueryString();

/**
 * OnChange callback for inputfields
 */
function onChange({key, val}) {
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
    if(xhr.statusText === 'OK' && xhr.status === 200 && xhr.responseText.length){
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

function resetToDefault(){
  window.localStorage.removeItem('hejmdal');
  window.location = `${window.hejmdal.host}/logud?redirect=/example/example.html`;
}

/**
 * Parses the URL for queries
 *
 * @return {{}}
 */
function parseQueryString(){
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
function setState(){
  document.getElementById('input-login-url').value = window.hejmdal.host + '/login';
  document.getElementById('input-login-token').value = window.hejmdal.token;

  document.getElementById('currenturl').textContent = `${window.hejmdal.host}/login?token=${window.hejmdal.token}`;

  document.getElementById('tickettoken').innerHTML = window.hejmdal.tickettoken || '&nbsp;';
  document.getElementById('ticketid').innerHTML = window.hejmdal.ticketid || '&nbsp;';
  document.getElementById('post-success').className = window.hejmdal.tickettoken ? '' : 'hide';
  document.getElementById('ticketurl').innerHTML = window.hejmdal.tickettoken ? `${window.hejmdal.host}/getTicket/${window.hejmdal.tickettoken}/${window.hejmdal.ticketid}` : '&nbsp;';

  // Ticket
  if(window.hejmdal.ticket) {
    // if ticket has been stored in localStorage it will be a string and JSON.stringify will fail
    if(typeof window.hejmdal.ticket === 'string') {
      window.hejmdal.ticket = JSON.parse(window.hejmdal.ticket);
    }
    document.getElementById('ticketcontainer').classList.remove('hide');
  }

  document.getElementById('ticket').textContent = JSON.stringify(window.hejmdal.ticket, null, '  ') || '&nbsp;';

  window.localStorage.setItem('hejmdal', JSON.stringify(window.hejmdal));
}

/**
 * Init method called by the end of HTML rendering
 */
function init() {
  const storage = window.localStorage.getItem('hejmdal');

  if(storage){
    try{
      window.hejmdal = JSON.parse(storage)
    }
    catch (e){
      console.error('Could not object from localStorage', e);
    }
  }

  if(queryObj.token) {
    window.hejmdal.tickettoken = queryObj.token;
    window.hejmdal.ticketid = queryObj.id;
  }

  setState();
  console.log(window.hejmdal);
}
