[![NSP Status](https://nodesecurity.io/orgs/dbcdk/projects/4eba54f1-c2ff-4d1e-ab6f-80ae788ec29c/badge)](https://nodesecurity.io/orgs/dbcdk/projects/4eba54f1-c2ff-4d1e-ab6f-80ae788ec29c)
[![David](https://img.shields.io/david/DBCDK/hejmdal.svg?style=flat-square)](https://david-dm.org/DBCDK/hejmdal#info=dependencies)
[![David](https://img.shields.io/david/dev/DBCDK/hejmdal.svg?style=flat-square)](https://david-dm.org/DBCDK/hejmdal#info=dev)
[![bitHound Overall Score](https://www.bithound.io/github/DBCDK/hejmdal/badges/score.svg)](https://www.bithound.io/github/DBCDK/hejmdal)
[![Build Status](https://travis-ci.org/DBCDK/hejmdal.svg?branch=master)](https://travis-ci.org/DBCDK/hejmdal)

# hejmdal
*Heimdall eller Hejmdal (norrønt: Heimdallr) [...] har en fantastisk hørelse, og optræder af den grund i myterne som gudernes vagtmand, der sidder ved enden af Bifrost og overvåger, at ingen jætter sniger sig ind i Asgård.*
[Wikipedia](https://da.wikipedia.org/wiki/Hejmdal)

##Opstart
###Udvikling
Efter repositortiet er bevet klonet og afhængigheder er blevet installeret med `npm install` kan applikationen startes med `npm run dev`. Denne kommando starter applikationen med [nodemon](https://www.npmjs.com/package/nodemon) der sikre genstart af applikationen når kode er ændres.  
###Produktion
I produktion vil opstarten afhænge af hvilke værktøjer der benyttes men i sin reneste form kan applikationen startes med `node src/main.js` fra roden af projektet. 

##Tests
Testsuiterne afvikles generelt med kommandoen `npm run test` der er specificeret i `package.json`.  
Skal der tests på i et CI miljø på f.eks. Jenkins skal environment variablen `JUNIT_REPORT_PATH` sættes til den ønskede destination. F.eks. `JUNIT_REPORT_PATH=/report.xml npm run test`
 Bemærk at `npm run test` køres med `LOG_LEVEL=OFF` hvilket betyder at logning er slået fra under test.  
Se iøvrigt [mocha-jenkins-reporter](https://www.npmjs.com/package/mocha-jenkins-reporter)

##Logning
Der logges til `stdout` med de levels der er specificeret i afsnittet om Environment variabler herunder.

##Environment variabler
- `HEJMDAL_DB_HOST`
DB host
- `HEJMDAL_DB_NAME`
Navn på hejmdals db
- `HEJMDAL_DB_USER`
db-bruger
- `HEJMDAL_DB_USER_PASSWORD`
Password til hejmdal db-bruger
- `LOG_LEVEL`
Specificere hvilket maximum loglevel applikationen skal bruge. Default: `INFO`
Følgende levels kan bruges: `OFF` (0), `ERROR` (1), `WARN` (2), `WARNING` (2), `INFO` (3), `DEBUG` (4), `TRACE` (5)
- `NODE_ENV`
Når applikationen køres i produktion bør `NODE_ENV` sættes til `production`: `NODE_ENV=production` 
- `PORT`
Specificere hvilken port applikatioen skal være tilgængelig på. Default: `3010`
- `PRETTY_LOG`
Sæt `PRETTY_LOG` til hvilken som helst værdi og alle logstatements vil blive pretty-printed. Hvis `PRETTY_LOG` er udefineret holdes logstatements på en enkelt linje.
- `SESSION_LIFE_TIME`
Specificere en brugers sessions levetid. Default er 24 timer. Værdien er et tal og skal angives i millisekunder f.eks. er 24 timer = 86400000 (60 * 60 * 24 * 1000)

# Dokumentation
## Endpoints
- `/logud` eller `/logud?redirect=URL` 
En brugers session på login.bib.dk fjernes og hvis `?redirect` parameteren er sat redirected browseren til den givne URL. Alternativt bliver browseren på login.bib.dk og der vises en kort besked om at brugeren er logget ud. 

