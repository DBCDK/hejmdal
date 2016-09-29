[![NSP Status](https://nodesecurity.io/orgs/dbcdk/projects/4eba54f1-c2ff-4d1e-ab6f-80ae788ec29c/badge)](https://nodesecurity.io/orgs/dbcdk/projects/4eba54f1-c2ff-4d1e-ab6f-80ae788ec29c)
[![David](https://img.shields.io/david/DBCDK/hejmdal.svg?style=flat-square)](https://david-dm.org/DBCDK/hejmdal#info=dependencies)
[![David](https://img.shields.io/david/dev/DBCDK/hejmdal.svg?style=flat-square)](https://david-dm.org/DBCDK/hejmdal#info=devDependencies)
[![bitHound Code](https://www.bithound.io/github/DBCDK/hejmdal/badges/code.svg)](https://www.bithound.io/github/DBCDK/hejmdal)
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
Se iøvrigt [mocha-jenkins-reporter](https://www.npmjs.com/package/mocha-jenkins-reporter)

##Logning
Der logges til `stdout` med de levels der er specificeret i afsnittet om Environment variabler herunder.

##Environment variabler
- `PORT`
Specificere hvilken port applikatioen skal være tilgængelig på. Default: `3010`
- `LOG_LEVEL`
Specificere hvilket maximum loglevel applikationen skal bruge. Default: `INFO`
Følgende levels kan bruges: `OFF` (0), `ERROR` (1), `WARN` (2), `WARNING` (2), `INFO` (3), `DEBUG` (4), `TRACE` (5)
