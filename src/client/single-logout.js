class SingleLogout {
  constructor(container, {clients, redirect_uri, link, serviceName}) {
    this.link = link;
    this.serviceName = serviceName;
    this.clients = clients;
    this.redirect_uri = redirect_uri;
    this.iframeWrapper = document.createElement('div');
    this.iframeWrapper.classList.add('iframeWrapper');
    this.stateWrapper = document.createElement('div');
    this.stateWrapper.classList.add('stateWrapper');
    container.appendChild(this.stateWrapper);
    container.appendChild(this.iframeWrapper);
  }

  async logoutClients() {
    try {
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
    } catch (error) {
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
    if (this.redirect_uri) {
      window.location = this.redirect_uri;
    }
    return `
    <div class="success">
      <p>Du er nu blevet logget ud af bibliotekslogin</p>
      ${this.returnLink()}
    </div>`;
  }
  onError() {
    return `
      <div>
        <p>Det har ikke været muligt at logge dig ud af alle dine bibliotekstjenester. Du skal istedet lukke din browser for at logge helt ud.</p>
        ${this.returnLink()}
      </div>`;
  }

  returnLink() {
    if (this.link && this.serviceName) {
      return `<a href=${this.link}>Tilbage til ${this.serviceName}</a>`;
    }
  }

  logoutFrame(client, wrapper) {
    if (!client.singleLogoutUrl) {
      return Promise.reject();
    }
    const iframeElement = document.createElement('iframe');
    iframeElement.setAttribute('id', client.clientId);
    iframeElement.style.visibility = 'hidden';
    iframeElement.style.position = 'absolute';
    wrapper.appendChild(iframeElement);
    iframeElement.setAttribute('src', client.singleLogoutUrl);

    return new Promise((resolve, reject) => {
      iframeElement.addEventListener('load', e => {
        try {
          const document =
            iframeElement.contentDocument ||
            iframeElement.contentWindow.document;
          const {statusCode = 500} = JSON.parse(document.body.innerHTML);
          if (Number(statusCode) === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error(error); // eslint-disable-line no-console
          resolve(false);
        }
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
