[![NSP Status](https://nodesecurity.io/orgs/dbcdk/projects/4eba54f1-c2ff-4d1e-ab6f-80ae788ec29c/badge)](https://nodesecurity.io/orgs/dbcdk/projects/4eba54f1-c2ff-4d1e-ab6f-80ae788ec29c)
[![bitHound Dependencies](https://www.bithound.io/github/DBCDK/hejmdal/badges/dependencies.svg)](https://www.bithound.io/github/DBCDK/hejmdal/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/DBCDK/hejmdal/badges/devDependencies.svg)](https://www.bithound.io/github/DBCDK/hejmdal/master/dependencies/npm)
[![bitHound Overall Score](https://www.bithound.io/github/DBCDK/hejmdal/badges/score.svg)](https://www.bithound.io/github/DBCDK/hejmdal)
[![Build Status](https://travis-ci.org/DBCDK/hejmdal.svg?branch=master)](https://travis-ci.org/DBCDK/hejmdal)

# hejmdal

_Heimdall (Hejmdal in Danish, Heimdallr in Norrønt) is attested as possessing foreknowledge, keen eyesight and hearing, is described as "the whitest of the gods" and keeps watch for the onset of Ragnarök while drinking fine mead in his dwelling Himinbjörg, located where the burning rainbow bridge Bifröst meets heaven_
[Wikipedia](https://en.wikipedia.org/wiki/Heimdallr)

## MOVED to private git

As of may 2end 2024, the code is moved to DBC's git repository. Contact [DBC](http://dbc.dk)

## Releases

Releases are found at GitHub [/releases](https://github.com/DBCDK/hejmdal/releases). Each containing a link to the changelog for the given release. A consolidated changelog for all releases is found at [CHANGELOG.md](https://github.com/DBCDK/hejmdal/blob/master/CHANGELOG.md) in the project root.  
The changelog is made with [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator) and can be created with the command `github_changelog_generator -u DBCDK -p hejmdal --exclude-tags-regex "(jenkins-|\d\.\d\d{1,})"` -- you may need a valid github token to run the command.

## Start

### Development

After cloning the repository, run `npm install` to install dependencies. Copy env.test to env.env and set the environment variables (see below) to you need/liking. The application is started with `npm run dev`, which include [nodemon](https://www.npmjs.com/package/nodemon) in order to restart the application, when the code is changed.

To use a local database, postgres has to be installed. User, password and database are set through environment variables - see [Migration](https://github.com/DBCDK/hejmdal#migration) below.

### Production

You can start the application with `node src/main.js` from the project root after setting the environment variables.

### Migration

To install the latest database changes, run `npm run migrate:latest` to update the database tables. When installing the application, you must run the command to create the needed tables.

For development you use `npm run migrate:latest:dev` to source the env.env file before updating the tables.

## Example application

Can be found at https://login.bib.dk/example

## Tests

### Unittests

The tests are run by `npm run test` - specifications can be found in `package.json`.  
To test in a CI environment, like Jenkins, the environment variable `JUNIT_REPORT_PATH` must be set, like `JUNIT_REPORT_PATH=/report.xml npm run test`  
Note then `npm run test` sets `LOG_LEVEL=OFF` to disable logging during the tests.  
See [mocha-jenkins-reporter](https://www.npmjs.com/package/mocha-jenkins-reporter)

## Logging

Logging use `stdout` and the levels specified in [environment variables](https://github.com/DBCDK/hejmdal#environment-variables) below.

## Environment variables

The variables are specified at the form `name : internal config object`. References in the log from the startup, will use the internal config object.

- `AES_256_SECRET` : `hash.aes256Secret`  
  A secret used for encrypting stuff, needs to be 32 ASCII characters long.

- `BORCHK_SERVICEREQUESTER` : `borchk.serviceRequester`  
  The serviceRequester for borchk when fetching userinfo. Defaults to login.bib.dk

- `BORCHK_WSDL_URI` : `borchk.uri`  
  The address of the borchk WSDL

- `CULR_WSDL_URI` : `culr.uri`  
  URL to CULR WSDL

- `CULR_USER_ID_AUT` : `culr.userIdAut`  
  CULR autentification ID

- `CULR_GROUP_ID_AUT` : `culr.groupIdAut`  
  CULR autentification group ID

- `CULR_PASSWORD_AUT` : `culr.passwordAut`  
  CULR autentification password

- `CULR_PROFILE_NAME` : `culr.profileName`  
  CULR profile name

- `FL_IP_MAXFAIL` : `failedLogin.ip.maxFails`  
  Number of continous failed logins from the same ip-adress. Defaults to 100

- `FL_IP_BLOCK_SECONDS` : `failedLogin.ip.blockSeconds`  
  Number of seconds an ip-adresse will be blocked. Defaults to 1200

- `FL_IP_RESET_SECONDS` : `failedLogin.ip.resetSeconds`  
  Number of seconds a failed ip login is kept. Defaults to 86400

- `FL_USER_MAXFAIL` : `failedLogin.userId.maxFails`  
  Number of continous failed logins using the same userId. Defaults to 3

- `FL_USER_BLOCK_SECONDS` : `failedLogin.userId.blockSeconds`  
  Number of seconds an userId will be blocked. Defaults to 1200

- `FL_USER_RESET_SECONDS` : `failedLogin.userId.resetSeconds`  
  Number of seconds a failed userId login is kept. Defaults to 86400

- `GATEWAYF_URI` : `gatewayf.uri`  
  The address of the gatewayf service

- `GC_SESSION_DIVISOR` : `garbageCollect.session.divisor`  
  Defines the probability that sessions are garbage collected on every request. The probability is calculated as 1/GC_SESSION_DIVISOR.

- `GC_SESSION_SECONDS` : `garbageCollect.session.seconds`  
  Number of seconds a session has lived in order to be a garbage collected. Defaults to 2678400 (31 days)

- `GC_TICKET_DIVISOR` : `garbageCollect.ticket.divisor`  
  Defines the probability that tickets are garbage collected on every request. The probability is calculated as 1/GC_TICKET_DIVISOR.

- `GC_TICKET_SECONDS` : `garbageCollect.ticket.seconds`  
  Number of seconds a ticket has lived in order to be a garbage collected. Defaults to 3600 (1 hour)

- `GC_FAILEDLOGIN_DIVISOR` : `garbageCollect.failedlogin.divisor`  
  Defines the probability that failedlogins are garbage collected on every request. The probability is calculated as 1/GC_FAILEDLOGIN_DIVISOR.

- `GC_FAILEDLOGIN_SECONDS` : `garbageCollect.failedlogin.seconds`  
  Number of seconds a failedlogins has lived in order to be a garbage collected. Defaults to 36000 (10 hour)

- `HASH_SHARED` : `hash.shared`  
  Hash salt secret. Generally used to generate and check hash keys

- `HEJMDAL_CLIENT_ID` : `smaug.hejmdalClientId`  
  Hejmdals own smaug client id. The Hejmdal service client should be configured to not ask for consent.
  It is used in the cases where an end user logs into its Hejmdal profile, i.e. not redirected to an external service.

- `HEJMDAL_DB_CONNECTIONS_POOL_MAX` : `postgres.pool.max`  
  Maximum connections in pool

- `HEJMDAL_DB_CONNECTIONS_POOL_MIN` : `postgres.pool.min`  
  Minimum connections in pool

- `HEJMDAL_DB_HOST` : `postgres.connection.host`  
  Database host

- `HEJMDAL_DB_NAME` : `postgres.connection.database`  
  Name of hejmdals database

- `HEJMDAL_DB_USER` : `postgres.connection.user`  
  Database user

- `HEJMDAL_DB_USER_PASSWORD` : `postgres.connection.password`  
  hejmdal database password.

- `HOST` : `app.host`  
  The address og the application (including protocol and port number).

- `LOG_LEVEL` : `log.level`  
  Specifies the log level used by the application. Defaults to `INFO`
  Log level constants supported:: `OFF` (0), `ERROR` (1), `WARN` (2), `WARNING` (2), `INFO` (3), `DEBUG` (4), `TRACE` (5)

- `MOCK_STORAGE` : `mock_storage`  
  Set to `1` to use memory storage for tickets and consent instead of persistent storage

- `MOCK_BORCHK`: `mock_externals.borchk`
  Set to `1` (`MOCK_BORCHK=1`) to mock borchk and use a predefined response

- `MOCK_CULR` : `mock_externals.culr`  
  Set to `1` (`MOCK_CULR=1`) to mock CULR and use a predefined response

- `MOCK_NEMLOGIN` : `mock_externals.nemlogin`  
  set to `1` (`MOCK_NEMLOGIN=1`) to mock NEM-Login (MitId) and use a predefined response

- `MOCK_VIPCORE`: `mock_externals.vipCore`  
  Set to `1` (`MOCK_VIPCORE=1`) to mock vipCore and use a predefined response

- `MOCK_SMAUG` : `mock_externals.smaug`  
  set to `1` (`MOCK_SMAUG=1`) to mock Smaug and use a predefined response

- `MOCK_UNILOGIN` : `mock_externals.unilogin`  
  set to `1` (`MOCK_UNILOGIN=1`) to mock UNI-Login and use a predefined response

- `MOCK_WAYF` : `mock_externals.wayf`  
  set to `1` (`MOCK_WAYF=1`) to mock WAYF and use a predefined response

- `MUNICIPALITY_AGENCY_HACK` : `municipalityHack`  
  List of space separated agencies where municipality is blindly taken, defaults to "100450 790900"

- `LOCAL_ID_AGENCIES` : `localIdAgencies`  
  List of space separated agencies which use local generated userId, like the royal library (800010)

- `REMOVE_ATTRIBUTE_AGENCIES` : `removeAttributeAgencies`  
  List of space separated agencies which is only returned if allLibraries is used, defaults to ""

- `NODE_ENV` : `app.env`  
  When run in production the `NODE_ENV` should be set to `production`: `NODE_ENV=production`

- `PORT` : `app.port`  
  Specifies the port to expose the application. Default: `3010`

- `PRETTY_LOG` : `log.pretty`  
  Set to `1` (`PRETTY_LOG=1`) for pretty printed log statements. Any other setting, will result in one-line log statements.

- `SESSION_LIFE_TIME` : `session.life_time`  
  The lifetime for a user session in milliseconds. Defaults to 86400000 (24 hours: 24 _ 60 _ 60 \* 1000 = 86400000)

- `SESSION_SECRET` : `session.secret`  
  Secret used for sessions

- `SMAUG_URI` : `smaug.uri`  
  The address of the Smaug service

- `SMAUG_CONFIG_URI` : `smaug.configUri`  
  The address of the Smaug config service

- `SMAUG_ADMIN_URI` : `smaug.adminUri`  
  The address of the Smaug admin service

- `SMAUG_ADMIN_USERNAME` : `smaug.adminUsername`  
  Smaug admin username

- `SMAUG_ADMIN_PASSWORD` : `smaug.adminPassword`  
  Smaug admin password

- `UNI_LOGIN_ID` : `unilogin.id`  
  UNI-Login ID

- `UNI_LOGIN_SECRET` : `unilogin.secret`  
  UNI-Login Secret

- `UNI_LOGIN_URL` : `unilogin.uniloginBasePath`  
  UNI-Login base URL (`https://sso.emu.dk/unilogin/login.cgi`)

- `UNI_LOGIN_MAX_TICKET_AGE` : `unilogin.maxTicketAge`  
  Max age of the ticket returned from UNI-Login upon successful authetication.  
  UNI-Loing recommends this value to be set to 60 seconds which is default in Hejmdal.

- `VIPCORE_URI` : `vipCore.uri`  
  The address to the vipCore service

- `VIPCORE_LIFE_TIME` : `vipCore.life_time`  
  Milliseconds before invalidating vipCore cache. Default to 3600000 (1 hour)

# Dokumentation

- [Documentation of oAuth2 endpoints](docs/oauth2.md)
- [Documentation of single logout](docs/single-logout.md)
- [Documentation of CAS integration](docs/cas.md)
- [Documentation of client configuration options](docs/configuration.md)
- [Documentation for new clients](docs/new-client.md)
- [Example klient](https://login.bib.dk/example)
