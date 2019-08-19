# Personal login with unilogin.

This document describes how to use login.bib.dk as a personal login for professional users using UNI-login.

By using the parameter `idp=unilogin` it is possible to force a user to log in through `unilogin`:

`https://login.bib.dk/oauth/authorize?response_type=code&clientId={CLIENT_ID}​​&redirection_uri={REDIRECTION_URI}&idp=unilogin`

This makes it possible for the client application to recieve a users UNI-login Id a list of UNI-login institutions, that the end user is connected to:

```
{
  "attributes": {
    "uniloginId": "myUniL0ginId",
    "uniLoginInstitutions": [
      {
        "id": "123DBC",
        "name": "DANSK BIBLIOTEKSCENTER A/S"
      },
      {
        "id": "456DBC",
        "name": "Some Institution Name"
      }
    ]
  }
}
```

This requires the client configuration to have been configured to request `uniloginId` and `uniLoginInstitutions`
