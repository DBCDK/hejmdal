/**
 * @file
 * This file includes mock implementations of auth.dbc.dk and serviceclients that imitate applications
 * such as DDB cms og bibliotek.dk
 */

import {Router} from 'express';
import {ATTRIBUTES} from '../utils/attributes.util';
const router = Router();

/**
 * SERVICE MOCKS
 */
const loggedInOnServices = new Map();
const serviceMockRouter = Router();
serviceMockRouter.get('/:service/login', (req, res) => {
  const {service} = req.params;
  const {agency = '733000'} = req.query;
  res.redirect(
    `/oauth/authorize?response_type=code&client_id=${service}&agency=${agency}&redirect_uri=${
      process.env.HOST
    }/test/service/${service}/callback`
  );
});
serviceMockRouter.get('/:service/callback', (req, res) => {
  const {service} = req.params;
  loggedInOnServices.set(service, true);
  res.send('ok');
});
serviceMockRouter.get('/:service/verify', (req, res) => {
  const {service} = req.params;
  res.send(loggedInOnServices.get(service) || false);
});
serviceMockRouter.get('/:service/logout', (req, res) => {
  const {service} = req.params;
  setTimeout(() => {
    loggedInOnServices.set(service, false);
    res.send(
      JSON.stringify({
        statusCode: service.includes('fail') ? 500 : 200
      })
    );
  }, 2000);
});

/**
 * SMAUG MOCK
 */
function createClient(clientId, overrides) {
  const clientDefaults = {
    grants: ['authorization_code', 'password', 'cas'],
    identityProviders: ['nemlogin', 'borchk', 'unilogin', 'wayf'],
    redirectUris: [
      `${process.env.HOST}`,
      `${process.env.HOST}/callback`,
      `${process.env.HOST}/example`,
      `${process.env.HOST}/example/provider/callback`,
      `${process.env.HOST}/test/service/${clientId}/callback`
    ],
    singleLogoutPath: `/test/service/${clientId}/logout`,
    displayName: 'Test Service',
    borchkServiceName: 'bibliotek.dk',
    attributes: ATTRIBUTES,
    requireConsent: false,
    app: {
      orderpolicyrequester: '190101',
      clientId,
      clientSecret: `${clientId}_secret`,
      clientName: `$${clientId} service`
    }
  };
  return {...clientDefaults, ...overrides};
}
const smaugClients = new Map();
const smaugMockRouter = Router();
smaugMockRouter.post('/:clientId', (req, res) => {
  const {clientId} = req.params;
  smaugClients.add(clientId, createClient(clientId));
  res.send('ok');
});
smaugMockRouter.post('/admin/clients/token/:clientId', (req, res) => {
  const {clientId} = req.params;
  const {password} = req.body;

  if (clientId.includes('hejmdal') && password !== 'fail') {
    res.send(
      JSON.stringify({
        access_token: clientId,
        expires_in: 3600,
        token_type: 'password'
      })
    );
  } else {
    res.status(403);
    res.send(
      JSON.stringify({
        error: 'invalid_client',
        statusMessage: 'some error happened'
      })
    );
  }
});
smaugMockRouter.get('/config/configuration', (req, res) => {
  const {token} = req.query;
  let overrides = {};
  if (token.includes('no-cas')) {
    overrides.grants = ['authorization_code', 'password'];
  }
  if (token.includes('no-single-logout-support')) {
    overrides.singleLogoutPath = null;
  }
  if (token.includes('hejmdal')) {
    res.send(JSON.stringify(createClient(token, overrides)));
  }
  if (token.includes('not-allowed-to-use-introspection-token')) {
    res.send(JSON.stringify(createClient('some_client', overrides)));
  }
  if (token.includes('im-all-allowed-to-use-introspection-token')) {
    overrides.introspection = true;
    res.send(JSON.stringify(createClient('some_client', overrides)));
  }
  if (token.includes('some_anonymous_token')) {
    overrides.expires = 'in the future';
    res.send(JSON.stringify(createClient('some_client', overrides)));
  }
  if (token.includes('some_authorized_token')) {
    overrides.expires = 'in the future';
    overrides.user = {uniqueId: 'some_authorized_user_id'};
    res.send(JSON.stringify(createClient('some_client', overrides)));
  } else {
    res.status(403);
    res.send(JSON.stringify({error: 'invalid_token'}));
  }
});

smaugMockRouter.post('/auth/oauth/token', (req, res) => {
  const {authorization} = req.headers;

  if (authorization === 'Basic: im-not-authorized') {
    // Sorry - No access_token for you
    res.send(JSON.stringify({}));
  }

  if (
    authorization ===
    'Basic: im-authorized-but-not-allowed-to-access-introspection'
  ) {
    res.send(
      JSON.stringify({access_token: 'not-allowed-to-use-introspection-token'})
    );
  }

  if (authorization === 'Basic: im-all-authorized') {
    res.send(
      JSON.stringify({
        access_token: 'im-all-allowed-to-use-introspection-token'
      })
    );
  }
});

router.use('/service', serviceMockRouter);
router.use('/smaug', smaugMockRouter);
export default router;
