# Client configuration

The following is a full list of possible configuration options

```json
{
  "grants": ["authorization_code", "password", "cas"],
  "attributes": {
    "cpr": {
      "name": "CPR-nummer",
      "description": "Brugerens CPR-nummer"
    },
    "userId": {
      "name": "Biblioteks bruger-id",
      "description": "Brugerens identitet på biblioteket - oftest CPR-nummer"
    },
    "uniqueId": {
      "name": "bruger ID",
      "description": "Unikt bruger ID, som ikke er personhenførbar"
    },
    "libraries": {
      "name": "Biblioteker",
      "description": "En liste over de biblioteker som kender brugeren"
    },
    "allLibraries": {
      "name": "Biblioteker",
      "description": "En liste over de biblioteker som kender brugeren inklusiv interne biblioteker"
    },
    "uniloginId": {
      "name": "CPR-nummer",
      "description": "Brugerens CPR-nummer"
    },
    "municipality": {
      "name": "Kommunenummer",
      "description": "3 cifret kommunenummer"
    },
    "municipalityAgencyId": {
      "name": "CPR-nummer",
      "description": "Brugerens CPR-nummer"
    },
    "birthDate": {
      "name": "Fødselsdato",
      "description": "Fødselsdato - 4 første cifre af CPR-nummer"
    },
    "birthYear": {
      "name": "Fødselsår",
      "description": "4 cifret fødselsår - taget fra CPR-nummer"
    },
    "gender": {
      "name": "Køn",
      "description": "Brugerens køn, m (for male) eller f (for female)"
    },
    "authenticatedToken": {
      "name": "Autentificeret Token",
      "description": "oAuth2 autentificeret token, der kan bruges til kalde openplatform.dbc.dk som autentificeret bruger"
    },
    "blocked": {
      "name": "Spærret bruger",
      "description": "boolean. true hvis brugeren er spærret"
    },
    "userPrivilege": {
      "name": "Bruger roller",
      "description": "Liste af roller som en bruger har på login biblioteket"
    },
    "idpUsed": {
      "name": "Valgt IDP",
      "description": "Navn på den IDP der er logget ind med"
    }
  },
  "display": {
    "title": "Titel på siden, default 'Netpunkt login'",
    "defaultUser": "Prechoosen user, default 'netpunkt'",
    "buttonColor": "Login button color, default #252525",
    "buttonTxtColor": "Login button color, default #ffffff",
    "buttonHoverColor": "Login button hover color, default #e56312",
    "buttonTxtHoverColor": "Login button hover text color, default #ffffff"
  },
  "logoColor": "Color of hejmdal logo, default #252525",
  "redirectUris": [],
  "singleLogoutPath": "/single-logout"
}
```

## grants

A list of possible grant types
`"grants": ["authorization_code", "password", "cas"]`

## redirectUris

A list of valid redirect uris. This list is used to validate redirect_uri on login and logout. If the uri provided by the client does not have an exact match on the list, an error is returned.

`"redirectUris": []`

## singleLogoutPath

A path used for single-logout. This is required for the client to support single-logout. login.bib.dk will always use the host from the redirect_uri provided at login, thus singleLogoutPath needs to be relative to the root of the host.

`"singleLogoutPath": "/single-logout"`

## attributes

Defines the list of attributes that _can_ be returned to the client service trought the `/userinfo` endpoint. As default uniqueId and municipality is returned if available.

* `cpr`: If the user logs in using a CPR-number, this will be provided,
* `userId`: Whatever ID the user have used for login.
* `uniqueId`: Global user ID, is provided for users recognized by the CULR database.
* `libraries`: List of public libraries the user is registered at.
* `municipality`: 3 diggit Minicipality ID.
* `municipalityAgencyId`: Agency ID matching the users municipality.
* `birthDate`: Extracted from CPR-number if possible
* `birthYear`: Extracted from CPR-number if possible
* `gender`: Extracted from CPR-number if possible
* `authenticatedToken`: oAuth2 authenticated token, can be used for requests to openplatform.dbc.dk as an authenticated user"
* `blocked`: Boolean. True if user is blocked at the login library
* `userPrivilege`: Array of userPrivileges from the login library
* `idpUsed`: Name of idp used ('borchk', 'dbcidp', 'netpunkt', 'unilogin', 'nemlogin', 'wayf')
  )

## display

Defines the layout of the DBC-IDP login form. If no custom display is used, the login page displayed will be identical to the one used for Netpunkt.  
