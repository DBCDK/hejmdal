import {Router} from 'express';
import _ from 'lodash';

import {
  getClientByToken,
  getTokenByAuth,
  getClientById,
  getMetadataByClientId
} from '../components/Smaug/smaug.client';
import {setDefaultState} from '../middlewares/state.middleware';
import {
  validateAuthRequest,
  clearClientOnSession,
  isUserLoggedIn,
  authorizationMiddleware,
  addClientToListOfClients,
  validateIntrospectionAccess,
  getClientByAuth
} from '../utils/oauth2.utils';

const router = Router();

/**
 * authorization
 * GET request:
 * - response_type=code - Indicates that your server expects to receive an authorization code
 * - client_id - The client ID you received when you first created the application
 * - redirect_uri - Indicates the URI to return the user to after authorization is complete
 * - scope - One or more scope values indicating which parts of the user's account you wish to access
 * - state - A random string generated by your application, which you'll verify later
 * verifies redirect_uri against client_id
 * response:
 * redirects to redirect_uri and adds authorizationCode in code and state from request is echoed back
 *
 */
router.get(
  '/authorize',
  clearClientOnSession,
  validateAuthRequest,
  isUserLoggedIn,
  setDefaultState,
  authorizationMiddleware,
  addClientToListOfClients
);

/**
 * POST request
 * Endpoint to return token informations
 * Informations: active, clientId, expires, uniqueId
 *
 * CURL Example request:
 * curl --user CLIENT_ID:CLIENT_SECRET -X POST login.bib.dk/oauth/introspection?access_token=MY_ACCESS_TOKEN
 *
 * @param {*} access_token
 * @returns obj
 */

router.post('/introspection', async (req, res) => {
  // Endpoint response
  let response = {error: null, status: 200, data: {}};

  // Retrieve Token from request body || query
  const token = req.body.access_token || req.query.access_token;

  if (token) {
    // Retrieve authorization string ("Basic" encoded CLIENT_ID:CLIENT_SECRET) from request header
    const auth = req.headers.authorization;

    // Validate authorization ("Basic" encoded CLIENT_ID:CLIENT_SECRET)
    // Used for checking that token can be returned from auth.dbc.dk
    const clientToken = await getTokenByAuth(auth);

    // If valid token returned
    if (clientToken) {
      // extract ClientId from Auth string
      const id = await getClientByAuth(auth);

      // Retrieve client by id
      const client = await getClientById(id);

      // Check if client is allowed to access introspection endpoint (by clientToken)
      // const isAllowed = await validateIntrospectionAccess(clientToken);
      const isAllowed = client.introspection;

      // If Cĺient is allowed to access the /introspection endpoint
      if (isAllowed) {
        try {
          // Retrieve client information from recieved token (access_token)
          const information = await getClientByToken(token);

          // Set client informations object
          const informationObj = {
            active: true,
            clientId: information.app.clientId,
            expires: information.expires,
            agency: _.get(information, 'user.agency', null),
            uniqueId: _.get(information, 'user.uniqueId', null),
            search: _.get(information, 'search', null),
            type: _.get(information, 'user.uniqueId', false)
              ? 'authorized'
              : 'anonymous'
          };

          // populate req.session with client information for logger middleware
          // client.app.clientId      contains clientId for the access_token used
          // information.app.clientId contains clientId for authorization client CLIENT_ID:CLIENT_SECRET
          req.session.client = {clientId: information.app.clientId};

          // Get client metadata
          let metaObj = {};
          if (informationObj.clientId) {
            const meta = await getMetadataByClientId(informationObj.clientId);

            // Set client metadata
            metaObj = {
              name: _.get(meta, 'name', null),
              contact: _.get(meta, 'contact', null)
            };
          }

          // Merge client informations and metadata and set response
          response.data = {...informationObj, ...metaObj};
        } catch (e) {
          // Token is invalid or expired - request is ok (status: 200)
          response.data = {active: false};
        }
      } else {
        response.status = 400;
        response.error = 'Client is not allowed to use /introspection endpoint';
      }
    } else {
      response.status = 403;
      response.error = 'Invalid client and/or secret';
    }
  } else {
    response.status = 403;
    response.error = 'Missing param access_token';
  }

  // Return status code
  res.status = response.status;

  // If all-good
  if (!response.error) {
    res.json(response.data);
  }
  // If something went wrong
  else {
    res.json({
      error: response.error
    });
  }
});

/**
 * token.
 * POST request:
 * - grant_type=authorization_code - The grant type for this flow is authorization_code
 * - code=AUTH_CODE_HERE - This is the code you received in the query string
 * - redirect_uri=REDIRECT_URI - Must be identical to the redirect URI provided in the original link
 * - client_id=CLIENT_ID - The client ID you received when you first created the application
 * - client_secret=CLIENT_SECRET - Since this request is made from server-side code, the secret is included
 * Response:
 * { "access_token":"RsT5OjbzRn430zqMLgV3Ia", "expires_in":3600 }
 * or
 * { "error":"invalid_request" }
 *
 */
router.post('/token', (req, res, next) => {
  const {grant_type, agency, username, password, client_id} = req.body;
  if (grant_type === 'password') {
    // With password grant we support both client credentials in header or body.
    const headerCredentials = getClientFromHeader(
      req.headers.authorization || ''
    );
    const normalizedAgency = agency.toLowerCase().replace('dk-', '');  // HEJMDAL-729
    req.body.username = {
      username,
      normalizedAgency,
      client_id: client_id || headerCredentials.client_id,
      ips: (req.ips.length && req.ips) || [req.ip],
      password
    };
  }
  req.app.oauth.token()(req, res, next);
});

/**
 * Extract client credentials from header.
 *
 * @param {*} authorization
 * @returns
 */
function getClientFromHeader(authorization) {
  if (!authorization) {
    return {};
  }
  const [type, b64auth = ''] = authorization.split(' ');
  const [client_id, client_secret] = new Buffer(b64auth, 'base64')
    .toString()
    .split(':');
  return {client_id, client_secret};
}

/**
 * revoke token.
 * DELETE request:
 * - access_token=ACCESS_TOKEN
 * Response:
 * {count:1} || {count:0}
 * or
 * { "error":"invalid_request"}
 *
 */
router.delete('/revoke', async (req, res) => {
  const token = req.query.access_token;

  if (token) {
    const response = await req.app.model.revokeToken(token);
    return res.json(response);
  }

  res.status = 400;
  res.json({
    error: 'no valid access_token'
  });
});

export default router;
