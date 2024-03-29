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
    "uniloginUniId": {
      "name": "Brugerens unilogin ID",
      "description": "Udleveret fra OIDC unilogin parameteren uniid"
    },
    "uniloginUserType": {
      "name": "Brugerens unilogin type",
      "description": "Udleveret fra OIDC unilogin parameteren aktoer_gruppe"
    },
    "uniloginHasLicense": {
      "name": "Brugerens licensforhold (boolean)",
      "description": "Udleveret fra OIDC unilogin parameteren userHasLicense"
    },
    "uniloginInstitutionIds": {
      "name": "Brugerens institutioner (array af ids eller null)",
      "description": "Udleveret fra OIDC unilogin parameteren institutionIds"
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
    },
    "agencyRights": ["Liste af produkter som tjekkes i DBCIDP for login biblioteket"],
    "municipaltyAgencyRights": ["Liste af produkter som tjekkes i DBCIDP mod hjemhørsbiblioteket"],
    "dbcidp": ["Produktrettigheder for det aktuelle agency"],
    "dbcidpUniqueId": {
      "name": "dbcidp unique id",
      "description": "Brugerens unique id i dbcidp"
    },
    "dbcidpUserInfo": {
      "name": "Bruger data fra dbcidp",
      "description": "name, contactMail og contactPhone i dbcidp"
    },
    "dbcidpRoles": ["Liste a brugerens roller (egenskaber) i dbcidp"],
    "tokenUser": {
      "name": "Bruger data indeholdt i tokenet",
      "description": "De bruger data der er indeholdt i tokenet. Bør kun udstilles til fortrolige klienter"
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
  "displayName": "The name of the client using hejmdal, used on the logout screen",
  "identityProviders" : ["List of idps available for the client (nemlogin, borchk, unilogin, wayf, netpunkt, dbcidp)"],
  "hideIdentityProviders" : ["List of idps hidden from the user. Available as passthru (idp parameter in login)"],
  "createCulrAccountAgency": "Create user in CULR in this agency, if not found. Only used by bibliotek.dk (190101)",
  "addAsMunicipalityLibrary":  "Array of agencIds to take type as 'folk', default []",
  "addAsResearchLibrary":  "Array of agencIds to take type as 'forsk', default []",
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
* `agencyRights`: Client selected list of rights (from DBCIDP) for the login agency
* `municipalityAgencyRights`: Client selected list of rights (from DBCIDP) for the users municipality agency
* `dbcidp`: List of rights from DBCIDP when used as idp
* `dbcidpUniqueId`: Anonymized identity of the uder in DBCIDP
* `dbcidpUserInfo`: name, contactMail and contactPhone for a user logged in via DBCIDP
* `dbcidpRoles`: List of roles for a user logged in via DBCIDP
* `serviceStatus`: service status for borchk and culr. Both should be 'ok'
  )

## display

Defines the layout of the DBC-IDP login form. If no custom display is used, the login page displayed will be identical to the one used for Netpunkt.  


## addAsMunicipalityLibrary and addAsResearchLibrary

Libraries in the borchk dropdown are split into type of library (municipality, research or other). 

These two addAs... settings can contain an array of libraries that will be added to the library type indicated by the name of the setting.

These settings is only used by a few clients

## identityProviders and hideIdentityProviders 

identityProviders defines the list of idp's available for the client. 
Choose from "borchk", "dbcidp", "netpunkt", "unilogin", "nemlogin", "wayf".
"dbcidp" and "netpunkt", can only be used alone.
Defaults to ["nemlogin", "borchk", "unilogin", "wayf"]

hideIdentityProviders can be used, to remove the possibility for the user to select a given idp.
Ie ["nemlogin"] will remove the button for nemlogin - passthru functionality (using the idp parameter on login), will still work,
