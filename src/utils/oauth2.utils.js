export function disableRedirectUrlCheck(req, res, next) {
  // This is a hack to allow all redirect_uris. This should only be included in the mock implementation.
  req.app.model.mock.clients[0].redirectUris.push(req.query.redirect_uri);
  next();
}

export async function validateAuthRequest(req, res, next) {
  if (req.query.client_id) {
    req.session.client = await req.app.model.getClient(req.query.client_id);
  }
  next();
}

export function isUserLoggedIn(req, res, next) {
  if (!req.session.user && req.session.client) {
    req.session.query = {
      state: req.query.state,
      scope: req.query.scope,
      client_id: req.query.client_id,
      redirect_uri: req.query.redirect_uri,
      response_type: req.query.response_type
    };

    return res.redirect('/login');
  }
  // If the user is not logged in, we should redirect user to an separate login endpoint
  next();
}

/**
 * Middleware for initializing oauth authorization.
 */
export function authorizationMiddleware(req, res, next) {
  const options = {
    authenticateHandler: {
      handle: req => {
        return {id: '12345'};
      },
      continueMiddleware: false
    }
  };
  return req.app.oauth.authorize(options)(req, res, next);
}
