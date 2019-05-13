In order to be able to communicate with a HA-proxy, the CAS protocol is implementet on top of the oAuth protocol

See https://apereo.github.io/cas/4.2.x/protocol/CAS-Protocol-Specification.html for CAS protocol reference

## 1. Login request

The client should make a redirect to the following url:

`https://login.bib.dk/cas/{client_id}/{agency_id}/login?service={return_uri}`

URL Params

- `client_id`: client ID
- `agency_id`: ID of the agancy the user should login to.

Query Params

- `service`: URI to be returned to when user authorization has been completed. Basepath must be configured on the client. If the full url contains a querystring it should be urlencoded.

On successfull authentication, the user i redirected back to the specified service url with a ticket.

`{return_uri}?ticket={ticket}`

## 2. validateTicket

To exchange a ticket obtained through step 1 a request to the serviceValidate endpoint should be make with the following parameters:

`GET https://login.bib.dk/cas/{client_id}/{agency_id}/serviceValidate?ticket={ticket}&service={redirect_uri}`

URL Params

- `client_id`: client ID
- `agency_id`: ID of the agancy the user should login to.

Query Params

- `ticket`: Ticket obtained though step 1.
- `service`: Should be the same redirect uri specified at step 1.

If the request is valid, the following response is given.

```xml
<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
  <cas:authenticationSuccess>
    <cas:user>username</cas:user>
  </cas:authenticationSuccess>
</cas:serviceResponse>
```

On failure the following response is given:

```xml
<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
  <cas:authenticationFailure code="{ERROR_CODE}">
    Ticket {TICKET} not recognized
  </cas:authenticationFailure>
</cas:serviceResponse>
```
