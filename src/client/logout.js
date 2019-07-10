class SingleLogout {
  constructor(container, {clients, returnurl}) {
    this.clients = clients;
    this.returnurl = returnurl;
    this.iframeWrapper = document.createElement('div');
    this.iframeWrapper.classList.add('iframeWrapper');
    this.stateWrapper = document.createElement('div');
    this.stateWrapper.classList.add('stateWrapper');
    container.appendChild(this.stateWrapper);
    container.appendChild(this.iframeWrapper);
  }

  async logoutClients() {
    this.updateState(this.onLoading());
    const responses = await Promise.all(
      this.clients.map(client => this.logoutFrame(client, this.iframeWrapper))
    );
    const isSuccessfull =
      responses.filter(response => response !== true).length === 0;
    if (isSuccessfull) {
      this.updateState(this.onSuccess());
    } else {
      this.updateState(this.onError());
    }
  }

  updateState(state) {
    this.stateWrapper.innerHTML = state;
  }

  onLoading() {
    return '<div class="spinner">Vi er i gang med at logge dig ud</div>';
  }
  onSuccess() {
    if (this.returnurl) {
      window.location = this.returnurl;
    }
    return '<div class="success">Du er nu blevet logget ud af bibliotekslogin</div>';
  }
  onError() {
    return '<div>Det har ikke været muligt at logge dig ud af alle dine bibliotekstjenester. Du skal istedet lukke din browser for at logge helt ud.</div>';
  }
  logoutFrame(client, wrapper) {
    const iframeElement = document.createElement('iframe');
    iframeElement.setAttribute('id', client.clientId);
    iframeElement.style.visibility = 'hidden';
    iframeElement.style.position = 'absolute';
    wrapper.appendChild(iframeElement);
    iframeElement.setAttribute('src', client.singleLogoutPath);

    return new Promise((resolve, reject) => {
      iframeElement.addEventListener('load', e => {
        const response = true;
        // TODO: get response from body
        resolve(response);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const singleLogout = new SingleLogout(
    document.getElementById('singlelogout'),
    window.singleLogoutData
  );
  singleLogout.logoutClients();
});
