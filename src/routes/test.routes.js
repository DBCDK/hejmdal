/**
 * @file
 * This file includes mock implementations of auth.dbc.dk and serviceclients that imitate applications
 * such as DDB cms og bibliotek.dk
 */

import {Router} from 'express';
import {ATTRIBUTES} from '../utils/attributes.util';
import {getClientByAuth} from '../utils/oauth2.utils';
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

function createMetadata(clientId, overrides = {}) {
  const metadataDefaults = {
    id: clientId,
    name: 'some_client_name',
    config: {},
    contact: {
      owner: {
        name: 'mrs. Owner',
        email: 'owner@mail.dk',
        phone: '+45 12345678'
      },
      'Technical contact': {
        name: 'mr. Technical',
        email: 'technical@mail.dk',
        phone: '+45 87654321'
      }
    },
    auth: null,
    createdAt: 'some_date',
    updatedAt: 'some_other_date'
  };
  return {...metadataDefaults, ...overrides};
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

  /* Removed when smaug auth call fixed */
  if (clientId.includes('-authorized')) {
    // Sorry - No access_token for you
    return res.send(JSON.stringify({access_token: clientId}));
  }
  /* ----------------------------------- */

  if (
    (clientId.includes('hejmdal') || clientId.includes('netpunkt')) &&
    password !== 'fail'
  ) {
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

  /* Removed when smaug auth call fixed */
  if (token.includes('im-not-authorized')) {
    return res.send(JSON.stringify(false));
  }
  if (token.includes('im-authorized-but-not-allowed-to-access-introspection')) {
    return res.send(JSON.stringify(createClient('some_client', overrides)));
  }
  if (token.includes('im-all-authorized')) {
    overrides.introspection = true;
    overrides.user = {uniqueId: 'some_authorized_user_id'};
    return res.send(JSON.stringify(createClient('some_client', overrides)));
  }
  /* ----------------------------------- */

  if (token.includes('not-allowed-to-use-introspection-token')) {
    return res.send(JSON.stringify(createClient('some_client', overrides)));
  }

  if (token.includes('im-all-allowed-to-use-introspection-token')) {
    overrides.introspection = true;
    return res.send(JSON.stringify(createClient('some_client', overrides)));
  }

  if (token.includes('some_anonymous_token')) {
    overrides.expires = 'in the future';
    return res.send(JSON.stringify(createClient('some_client', overrides)));
  }
  if (token.includes('some_authorized_token')) {
    overrides.expires = 'in the future';
    overrides.user = {
      uniqueId: 'some_authorized_user_id',
      agency: 'some_agency'
    };
    overrides.search = {
      profile: 'some_search_profile',
      agency: 'some_agency'
    };
    return res.send(JSON.stringify(createClient('some_client', overrides)));
  }

  if (token.includes('netpunkt')) {
    overrides.identityProviders = ['netpunkt'];
    return res.send(JSON.stringify(createClient(token, overrides)));
  }

  if (token.includes('no-cas')) {
    overrides.grants = ['authorization_code', 'password'];
  }

  if (token.includes('no-single-logout-support')) {
    overrides.singleLogoutPath = null;
  }

  if (token.includes('hejmdal')) {
    res.send(JSON.stringify(createClient(token, overrides)));
  } else {
    res.status(403);
    res.send(JSON.stringify({error: 'invalid_token'}));
  }
});

smaugMockRouter.post('/auth/oauth/token', (req, res) => {
  let {authorization} = req.headers;

  /* Removed when smaug auth call fixed */
  authorization = getClientByAuth(authorization);

  if (authorization === 'im-not-authorized') {
    return res.send(JSON.stringify({}));
  }
  if (
    authorization === 'im-authorized-but-not-allowed-to-access-introspection'
  ) {
    return res.send(
      JSON.stringify({access_token: 'not-allowed-to-use-introspection-token'})
    );
  }
  if (authorization === 'im-all-authorized') {
    return res.send(
      JSON.stringify({
        access_token: 'im-all-allowed-to-use-introspection-token'
      })
    );
  }
  /* ----------------------------------- */

  if (
    authorization ===
    'Basic: im-authorized-but-not-allowed-to-access-introspection'
  ) {
    return res.send(
      JSON.stringify({access_token: 'not-allowed-to-use-introspection-token'})
    );
  }

  if (authorization === 'Basic: im-all-authorized') {
    return res.send(
      JSON.stringify({
        access_token: 'im-all-allowed-to-use-introspection-token'
      })
    );
  }
});

smaugMockRouter.get('/admin/clients/:clientId', (req, res) => {
  const auth = getClientByAuth(req.headers.authorization);

  const {clientId} = req.params;

  if (auth === 'admin') {
    if (clientId === 'some_client') {
      return res.send(JSON.stringify(createMetadata(clientId)));
    }
    return res.send(JSON.stringify('unknown client'));
  }

  return res.send(JSON.stringify('unauthorized'));
});

/**
 * FORSRIGHTS MOCK
 */

const forsrightsMockRouter = Router();

// Validate user (forsrights)
forsrightsMockRouter.get('/validate', (req, res) => {
  const {action, userIdAut, groupIdAut, passwordAut} = req.query;
  const response = {forsRightsResponse: {error: null}};

  if (
    userIdAut === 'valid-user' &&
    groupIdAut === '100200' &&
    passwordAut === '123456'
  ) {
    return res.send(JSON.stringify(response));
  }

  // Simulate validation error (wrong login credentials)
  response.forsRightsResponse.error = true;
  return res.send(JSON.stringify(response));
});

router.use('/forsrights', forsrightsMockRouter);
router.use('/service', serviceMockRouter);
router.use('/smaug', smaugMockRouter);
export default router;
