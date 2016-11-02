window.hejmdal = {
  host: 'http://localhost:3010/v0/login',
  token: 'valid_token'
};

function onChange({key, val}) {
  window.hejmdal[key] = val;
  setState();
}

function onClick(e) {
  window.location = document.getElementById('currenturl').textContent;
}

function resetToDefault(){
  window.localStorage.removeItem('hejmdal');
  window.location = '/example/example.html';
}

function setState(){
  document.getElementById('input-login-url').value = window.hejmdal.host;
  document.getElementById('input-login-token').value = window.hejmdal.token;

  document.getElementById('currenturl').textContent = `${window.hejmdal.host}?token=${window.hejmdal.token}`;
  window.localStorage.setItem('hejmdal', JSON.stringify(window.hejmdal));
}

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

  setState();
}
