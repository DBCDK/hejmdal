# Beskrivelse af oAuth2 login flow.

For at logge ind med adgangsplatformen via oAuth skal man lave to kald. Hvis man også har brug for informationer om brugeren f.eks. cpr-nummer, skal man lave et 3. kald for at hente brugerdata ud.

Indtil videre er oAuth implementationen kun en mock som eksponerer API’et. Man skal bruge følgende client information:

**Dummy Klient**

- clientId: ‘hejmdal’
- clientSecret: ‘hejmdal_secret’

**Dummy bruger**

Den bruger man får retur vil altid være følgende:

```
{
  "attributes": {
    "userId": "0101701234",
    "uniqueId": "9ea16d6a9e2cbec5215fa4c35cfc3ea231a3481ffce5f75e998029527d3ec1e0",
    "agencies": [
      {
        "agencyId": "710100",
        "userId": "0101701234",
        "userIdType": "CPR"
      },
      {
        "agencyId": "714700",
        "userId": "12345678",
        "userIdType": "LOCAL"
      }
    ]
  }
}
```

## Login flow

### 1. Lav redirect til https://oauth.login.bib.dk/oauth/authorize

**redirect**
`https://oauth.login.bib.dk/oauth/authorize?response_type=code&clientId={CLIENT_ID}&redirection_uri={REDIRECTION_URI}&state={SOME_STATE_HASH}`

- response_type=code: Indikerer at klienten forventer at modtage en authorization code
- client_id: client ID (Hardcoded til hejmdal)
- redirect_uri - URI som der skal returneres til når bruger authorization er afsluttet. Skal være konfigureret i adgangsplatformen
- state - En hash genereret af klient applikationen, så applikationen kan verificere validiteten af returkaldet (state er indtil videre valgfrit).

**response**
Hvis login går godt, laves et redirect tilbage til den definerede {REDIRECT_URI} med følgende parametre:
`{REDIRECTION_URI}/?state={SOME_STATE_HASH}&code={AUTHORIZATION_CODE}`

En authorisation_code indikerer at en bruger har logget ind med adgangsplatformen. En authorisation_code er en engangskode, som kan bruges til at hente en access token med. Dette gøres i kald 2.

### 2. Server side kald til https://oauth.login.bib.dk/oauth/token

`curl -X POST http://localhost:3000/oauth/token -d 'grant_type=authorization_code&code={AUTH_CODE}&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&redirect_uri={REDIRECT_URI}'`

- code: authorization code som bleve returneret fra kald til `oauth/authorize`
- redirect_uri: Skal være samme redirect_uri, som benyttes for at hente authorization code.
- client_id: client ID (Hardcoded til hejmdal)
- client_secret: client secret (Hardcoded til hejmdal_secret)

**response**
{ "access_token":"RsT5OjbzRn430zqMLgV3Ia", "expires_in":3600 }

### 3. Server side kald til http://oauth.login.bib.dk/userinfo

Hvis man skal hente brugerinfo ud:

`curl -X POST https://oauth.login.bib.dk/userinfo -d ‘access_token={ACCESS_TOKEN}’`

response:

```
{
  "attributes": {
    "userId": "0101701234",
    "uniqueId": "9ea16d6a9e2cbec5215fa4c35cfc3ea231a3481ffce5f75e998029527d3ec1e0",
    "agencies": [
      {
        "agencyId": "710100",
        "userId": "0101701234",
        "userIdType": "CPR"
      },
      {
        "agencyId": "714700",
        "userId": "12345678",
        "userIdType": "LOCAL"
      }
    ]
  }
}
```

## Log ud

For at logge ud af adgangsplatformen laves et redirect til `https://oauth.login.bib.dk/logout/?access_token={ACCESS_TOKEN}`
