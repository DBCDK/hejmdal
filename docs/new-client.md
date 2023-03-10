## Information om brug bibliotekslogin

Bibliotekslogin (adgangsplatformen, login.bib.dk, hejmdal) tilbyder single-signon til biblioteks ressourcer og biblioteks relevante ressourcer.

Services som gerne vil benytte bibliotekslogin til autorisation af brugere, skal kontakte DBC, fx via [DBC kundeservice](http://kundeservice.dbc.dk)

## Opsætning hos DBC

Services der benytter bibliotekslogin, har en (eller flere) klient-opsætning(er) hos DBC, som fastsætter hvilke login muligheder der skal eksponeres, hvilke informationer der stilles til rådighed ifm login og lidt forskellige muligheder for trimning.

Hver klient er identificeret via et clientId samt en nøgle (clientSecret) som begge leveres af DBC ifm oprettelse.

For at kunne oprette klienten skal DBC som minimum have flg oplysninger:
* Kontakt person, kontakt mail og kontakt telefon
* retur url: En eller flere url'er som der redirectes til fra bibliotekslogin, fx: `https://mit_site.dk/bibl_login_callback/*` typisk en til drift og en til develop/staging

Derudover kan flg parametre sættes:
* displayName - som vises på login-siden ifm login
* logoColor - Farve på adgangsplatformens logo, default #252525
* singleLogoutPath - 



En liste over alle parametre kan ses [her](docs/configuration.md)

## Et eksempel

[bibliotek.dk](https://bibliotek.dk) benytter bibliotekslogin til autorisation af brugere.






## Mere information
* [danbib.dk](https://danbib.dk/login)
* [eksempel klient](http://login.bib.dk/example)
* [DBC kundeservice](http://kundeservice.dbc.dk)
* [OAuth2.0](https://oauth.net/2/)
* [DBC D1G1TAL](http://dbc.dk)

