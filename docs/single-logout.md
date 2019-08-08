
# Single logout

Single logout will log the user out of all applications the user has logged in to throughout a session. For this to happen, logout needs to be called with the parameter singlelogout=true, and all applications needs to have implemented a special single-logout endpoint, used by login.bib.dk to log out the user from each application. 

## 1\. [login.bib.dk/logout?singlelogout=true](http://login.bib.dk/logout?singlelogout=true)

To initiate single-logout initiate a redirect to login.bib.dk/logout?singlelogout=true&access_token={ACCESS_TOKEN}&redirect_uri={REDIRECT_URI}

Parameters:

-   singlelogout: (true|false) initiate single-logout or not 
-   access_token: (optional). If access_token is set a link back to the initiating client applikation is added
-   redirect_uri: (optional) If provided, the user is redirected back to the redirect_uri after successful login.
    -   Requires access_token to be set
    -   Requires the redirect_uri to be preconfigured.

## 2\. Single-logout endpoint

In order for an application to support single logout through login.bib.dk, an endpoint in the individual applications that meets the following criteria is required:

1.  The endpoint should clear the current session for the user. 
2.  This endpoint must approve iframing in the access platform, by setting the header `X-Frame-Options: allow-from https://login.bib.dk/`. See documentation for X-Frame-Options: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options>
3.  Endpoint must return a response in JSON containing a status code in body:

    ```json
    {
    	"statusCode": 200
    }
    ```
4.  Path to endpoint should be preconfigured on the client in login.bib.dk. The endpoint is configured as a relative path on the client. Login.bib.dk will add the host from the redirect_uri used at login. This way single-logout can be tested during development and staging.
