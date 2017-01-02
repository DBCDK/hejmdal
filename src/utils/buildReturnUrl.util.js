/**
 * Build a returnUrl from state.
 *
 * @param state
 * @param querystring
 * @returns {string}
 */
export default function buildReturnUrl(state, queryObject = {}) {
  let host = state.serviceClient.urls.host;
  let path = state.returnUrl || state.serviceClient.urls.returnUrl;
  let querystring = objectToQueryString(queryObject);

  if (path.charAt(0) !== '/') {
    path = '/' + path;
  }

  if (host.charAt(host.length - 1) === '/') {
    host = host.substr(0, host.length - 1);
  }

  return `${host}${path}${querystring}`;
}

/**
 * convert object to url query string.
 * @param queryObject
 * @returns {string}
 */
function objectToQueryString(queryObject) {
  let queryString = '';
  const keys = Object.keys(queryObject);

  if (keys.length) {
    queryString = '?' + keys.map(key => {
      const value = encodeURIComponent(queryObject[key]);
      return `${key}=${value}`;
    }).join('&');
  }

  return queryString;
}
