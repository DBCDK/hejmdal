[![NSP Status](https://nodesecurity.io/orgs/dbcdk/projects/4eba54f1-c2ff-4d1e-ab6f-80ae788ec29c/badge)](https://nodesecurity.io/orgs/dbcdk/projects/4eba54f1-c2ff-4d1e-ab6f-80ae788ec29c)
[![David](https://img.shields.io/david/DBCDK/hejmdal.svg?style=flat-square)](https://david-dm.org/DBCDK/hejmdal#info=dependencies)
[![David](https://img.shields.io/david/dev/DBCDK/hejmdal.svg?style=flat-square)](https://david-dm.org/DBCDK/hejmdal#info=dev)
[![bitHound Overall Score](https://www.bithound.io/github/DBCDK/hejmdal/badges/score.svg)](https://www.bithound.io/github/DBCDK/hejmdal)
[![Build Status](https://travis-ci.org/DBCDK/hejmdal.svg?branch=master)](https://travis-ci.org/DBCDK/hejmdal)

# hejmdal
*Heimdall (Hejmdal in danish, Heimdallr in Norrønt) is attested as possessing foreknowledge, keen eyesight and hearing, is described as "the whitest of the gods" and keeps watch for the onset of Ragnarök while drinking fine mead in his dwelling Himinbjörg, located where the burning rainbow bridge Bifröst meets heaven*
[Wikipedia](https://en.wikipedia.org/wiki/Heimdallr)

##Releases
Releases are found at GitHub [/releases](https://github.com/DBCDK/hejmdal/releases). Each containing a link to the changelog for the given release. A consolidated changelog for all releases is found at [CHANGELOG.md](https://github.com/DBCDK/hejmdal/blob/master/CHANGELOG.md) in the project root.  
The changelog is made with [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator) and can be created with the command `github_changelog_generator -u DBCDK -p hejmdal --exclude-tags-regex "(jenkins-|\d\.\d\d{1,})"` -- you may need a valid github token to run the command.

##Start
###Development
After cloning the repository, run `npm install` to install dependencies. Copy env.test to env.env and set the environment variables (see below) to you need/liking. The application is started with `npm run dev`, which include [nodemon](https://www.npmjs.com/package/nodemon) in order to restart the application, when the code is changed.

To use a local database, postgres has to be installed. User, password and database are set through environment variables - see [Migration](https://github.com/DBCDK/hejmdal#migration) below.

###Production
You can start the application with `node src/main.js` from the project root after setting the environment variables.

###Migration
To install the latest database changes, run `npm run migrate:latest` to update the database tables. When installing the application, you must run the command to create the needed tables.

For development you use `npm run migrate:latest:dev` to source the env.env file before updating the tables.

### Shrinkwrap
dependency versions are controlled with shrinkwrap. To update a dependency run `npm update <package__name>`, or recreate the dependency tree by deleting npm-shrinkwrap.json and running `npm update && npm shrinkwrap`.
  
##Example applikation
The frontpage links to an example application, demonstrating the flow through the application.  You need to fill out the url, path and token. After a succesfull login, you can fetch the ticket.

##Tests

### Unittests
The tests are run by `npm run test` - specifications can be found in `package.json`.  
To test in a CI environment, like Jenkins, the environment variable `JUNIT_REPORT_PATH` must be set, like `JUNIT_REPORT_PATH=/report.xml npm run test`  
Note then `npm run test` sets `LOG_LEVEL=OFF` to disable logging during the tests.  
See [mocha-jenkins-reporter](https://www.npmjs.com/package/mocha-jenkins-reporter)

### Integration tests
Integration tests run with [selenium](http://docs.seleniumhq.org/) are located in selenium/tests and are run with `npm run test:integration`. The tests use [saucelabs](https://saucelabs.com/) and require that the environment variable `SAUCE_USERNAME` og `SAUCE_ACCESS_KEY` are set.  

##Logging
Logging use `stdout` and the levels specified in [environment variables](https://github.com/DBCDK/hejmdal#environment-variables) below.

##Environment variables
The variables are specified at the form `name : internal config object`. References in the log from the startup, will use the internal config object.
- `BORCHK_URI` : `borchk.uri`  
The address of the borchk service

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

- `GATEWAYF_URI` : `gatewayf.uri`  
The address of the gatewayf service

- `GC_SESSION_DIVISOR` : `garbageCollect.session.divisor`  
Defines the probability that sessions are garbage collected on every request. The probability is calculated as  1/GC_SESSION_DIVISOR.

- `GC_SESSION_SECONDS` : `garbageCollect.session.seconds`  
Number of seconds a session has lived in order to be a garbage collected. Defaults to 2678400 (31 days)

- `GC_TICKET_DIVISOR` : `garbageCollect.ticket.divisor`  
Defines the probability that tickets are garbage collected on every request. The probability is calculated as  1/GC_TICKET_DIVISOR.

- `GC_TICKET_SECONDS` : `garbageCollect.ticket.seconds`  
Number of seconds a ticket has lived in order to be a garbage collected. Defaults to 3600 (1 hour)

- `HASH_SHARED` : `hash.shared`  
Hash salt secret. Generally used to generate and check hash keys

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
hejmdal database password

- `LOG_LEVEL` : `log.level`  
Specifies the log level used by the application. Defaults to `INFO`
Log level constants supported:: `OFF` (0), `ERROR` (1), `WARN` (2), `WARNING` (2), `INFO` (3), `DEBUG` (4), `TRACE` (5)

- `MOCK_BORCHK`: `mock_externals.borchk`
Set to `1` (`MOCK_BORCHK=1`) to mock borchk and use a predefined response

- `MOCK_CONSENT_STORAGE` : `mock_storage.consent`  
Set to `1` to use memory storage instead of persistent storage

- `MOCK_CULR` : `mock_externals.culr`  
Set to `1` (`MOCK_CULR=1`) to mock CULR and use a predefined response

- `MOCK_NEMLOGIN` : `mock_externals.nemlogin`  
set to `1` (`MOCK_NEMLOGIN=1`) to mock NEM-Login and use a predefined response
 
- `MOCK_OPENAGENCY`: `mock_externals.openAgency`
Set to `1` (`MOCK_OPENAGENCY=1`) to mock openAgency and use a predefined response

- `MOCK_SESSION_STORAGE` : `mock_storage.session`  
Set to `1` to use memory storage instead of persistent storage

- `MOCK_TICKET_STORAGE` : `mock_storage.ticket`  
Set to `1` to use memory storage instead of persistent storage

- `MOCK_SMAUG` : `mock_externals.smaug`  
set to `1` (`MOCK_SMAUG=1`) to mock Smaug and use a predefined response

- `MOCK_UNILOGIN` : `mock_externals.unilogin`  
set to `1` (`MOCK_UNILOGIN=1`) to mock UNI-Login and use a predefined response
 
- `MOCK_WAYF` : `mock_externals.wayf`  
set to `1` (`MOCK_WAYF=1`) to mock WAYF and use a predefined response
 
- `NODE_ENV` : `app.env`  
When run in production the `NODE_ENV` should be set to `production`: `NODE_ENV=production`
 
- `OPENAGENCY_URI` : `openAgency.uri`  
The address to the openAgency service

- `PORT` : `app.port`  
Specifies the port to expose the application. Default: `3010`

- `PRETTY_LOG` : `log.pretty`  
Set to `1` (`PRETTY_LOG=1`) for pretty printed log statements. Any other setting, will result in one-line log statements.
 
- `SESSION_LIFE_TIME` : `session.life_time`  
The lifetime for a user session in milliseconds. Defaults to 86400000 (24 hours: 24 * 60 * 60 * 1000 = 86400000)

- `SMAUG_URI` : `smaug.uri`  
The address of the Smaug service

- `SAUCE_USERNAME` : `brugernavn`  
Saucelabs user name

- `SAUCE_ACCESS_KEY` : `access key`  
Saucelabs user access key

- `UNI_LOGIN_ID` : `unilogin.id`  
UNI-Login ID

- `UNI_LOGIN_SECRET` : `unilogin.secret`  
UNI-Login Secret

- `UNI_LOGIN_URL` : `unilogin.uniloginBasePath`  
UNI-Login base URL (`https://sso.emu.dk/unilogin/login.cgi`)

- `UNI_LOGIN_MAX_TICKET_AGE` : `unilogin.maxTicketAge`
  Max age of the ticket returned from UNI-Login upon successful authetication.  
  UNI-Loing recommends this value to be set to 60 seconds which is default in Hejmdal.

- `TEST_ENV` : `local`  
Set to `local` to run selenium tests locally. Defaults to `saucelabs`

# Dokumentation
## Endpoints
- `/login?token=ABC_123&returnurl=someRelativeCallBackUrl&agency=myAgencyId` 
Login URL. If the token parameter is incorrect (or missing) a http error 403 is returned. The returnurl specifies the relative callbach url for the calling service. If the agency (6-digit library number) is set, the borchk identity provider will automatically select the agency.
- `/logout` eller `/logout?returnurl=someRelativeCallBackUrl` 
The users session is removed. The returnurl contains the relative callback url for the calling service. If the user session contains information from an identityprovider which has some special login/logout style, a message is presented with information about how the user should handle this - some identity providers do not support a logout operation, so in order to logout properly, the user has to close all browser windows.

