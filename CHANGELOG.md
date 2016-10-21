# Change Log

## [0.2.0](https://github.com/DBCDK/hejmdal/tree/0.2.0) (2016-10-20)
[Full Changelog](https://github.com/DBCDK/hejmdal/compare/0.1.0...0.2.0)

**Closed issues:**

- Salt der bruges til at hashe med skal sættes i en env var [\#83](https://github.com/DBCDK/hejmdal/issues/83)
- Implementere SMAUG operationer mod en test instans af SMAUG [\#69](https://github.com/DBCDK/hejmdal/issues/69)
- Metoder til at sætte og hente state.  [\#85](https://github.com/DBCDK/hejmdal/issues/85)
- Opgrader node version [\#84](https://github.com/DBCDK/hejmdal/issues/84)
- Dokumentation af Migrations via knex i README [\#77](https://github.com/DBCDK/hejmdal/issues/77)
- knexfile.js skal læse fra config.utils.js [\#76](https://github.com/DBCDK/hejmdal/issues/76)
- Hejmdal kan ikke bygge med version 0.12.4 af knex [\#74](https://github.com/DBCDK/hejmdal/issues/74)
- TicketStore - tickets skal gemmes i permanent storage \(postgress\) [\#55](https://github.com/DBCDK/hejmdal/issues/55)
- Info til bruger ved logud [\#54](https://github.com/DBCDK/hejmdal/issues/54)
- SessionStore - garbageCollection af udløbne cookies [\#53](https://github.com/DBCDK/hejmdal/issues/53)
- TicketStore - garbageCollection af ikke indløste tickets [\#52](https://github.com/DBCDK/hejmdal/issues/52)
- CULR identitet skal gemmes i session [\#46](https://github.com/DBCDK/hejmdal/issues/46)
- Tjek om bruger allerede er logget ind [\#45](https://github.com/DBCDK/hejmdal/issues/45)
- Check af environment vars ved startup [\#43](https://github.com/DBCDK/hejmdal/issues/43)
- tilpas pipeline med stg maskiner [\#15](https://github.com/DBCDK/hejmdal/issues/15)
- opret stagingmiljø til login.bib.dk [\#13](https://github.com/DBCDK/hejmdal/issues/13)
- SMAUG mock [\#10](https://github.com/DBCDK/hejmdal/issues/10)
- ConsentStore Controller [\#9](https://github.com/DBCDK/hejmdal/issues/9)
- Dummy CULR Component [\#8](https://github.com/DBCDK/hejmdal/issues/8)
- Komponent: IdentityProvider [\#5](https://github.com/DBCDK/hejmdal/issues/5)
- Pipeline: Jenkins++ \(intern\) / initiel [\#3](https://github.com/DBCDK/hejmdal/issues/3)

**Merged pull requests:**

- Issue 102 fvs [\#105](https://github.com/DBCDK/hejmdal/pull/105) ([fvsdbc](https://github.com/fvsdbc))
- Added tests of state middleware [\#104](https://github.com/DBCDK/hejmdal/pull/104) ([vibjerg](https://github.com/vibjerg))
- Add methods for updating state and user on session [\#103](https://github.com/DBCDK/hejmdal/pull/103) ([vibjerg](https://github.com/vibjerg))
- \#52 \#53 : Garbage collection in persistent storage for ticket and ses… [\#101](https://github.com/DBCDK/hejmdal/pull/101) ([fvsdbc](https://github.com/fvsdbc))
- \#84: Opgrader node version [\#99](https://github.com/DBCDK/hejmdal/pull/99) ([hrmoller](https://github.com/hrmoller))
- Tester consent.component [\#98](https://github.com/DBCDK/hejmdal/pull/98) ([hrmoller](https://github.com/hrmoller))
- dump ctx [\#97](https://github.com/DBCDK/hejmdal/pull/97) ([fvsdbc](https://github.com/fvsdbc))
- \#7: ticket component and test aligned to new context [\#96](https://github.com/DBCDK/hejmdal/pull/96) ([fvsdbc](https://github.com/fvsdbc))
- revised context [\#94](https://github.com/DBCDK/hejmdal/pull/94) ([fvsdbc](https://github.com/fvsdbc))
- import typo [\#93](https://github.com/DBCDK/hejmdal/pull/93) ([fvsdbc](https://github.com/fvsdbc))
- env vars in test.env for easier mock of externals and db's [\#92](https://github.com/DBCDK/hejmdal/pull/92) ([fvsdbc](https://github.com/fvsdbc))
- Smaug client that fetches configuration from a smaug webservice [\#91](https://github.com/DBCDK/hejmdal/pull/91) ([vibjerg](https://github.com/vibjerg))
- \#83: README and doc-adjust [\#90](https://github.com/DBCDK/hejmdal/pull/90) ([fvsdbc](https://github.com/fvsdbc))
- \#9: Postgres layer impolemented in ConsentStore [\#89](https://github.com/DBCDK/hejmdal/pull/89) ([hrmoller](https://github.com/hrmoller))
- \#83: move hash secret to environment [\#87](https://github.com/DBCDK/hejmdal/pull/87) ([fvsdbc](https://github.com/fvsdbc))
- \#9: ConsentStore Controller [\#82](https://github.com/DBCDK/hejmdal/pull/82) ([hrmoller](https://github.com/hrmoller))
- \#10 added smaug komponent with a mock client. [\#81](https://github.com/DBCDK/hejmdal/pull/81) ([vibjerg](https://github.com/vibjerg))
- Tilføj en prod migrate kommando [\#80](https://github.com/DBCDK/hejmdal/pull/80) ([vibjerg](https://github.com/vibjerg))
- \#11: move endpoint for getTicket [\#79](https://github.com/DBCDK/hejmdal/pull/79) ([fvsdbc](https://github.com/fvsdbc))
- Tilføjet dokumentation om brug af postgres og migrations [\#78](https://github.com/DBCDK/hejmdal/pull/78) ([vibjerg](https://github.com/vibjerg))
- lock knex to version 0.12.3 [\#75](https://github.com/DBCDK/hejmdal/pull/75) ([vibjerg](https://github.com/vibjerg))
- Issue 55 fvs [\#61](https://github.com/DBCDK/hejmdal/pull/61) ([fvsdbc](https://github.com/fvsdbc))
- \#8: Dummy CULR Component [\#95](https://github.com/DBCDK/hejmdal/pull/95) ([hrmoller](https://github.com/hrmoller))
- \#43: Check af environment vars ved startup [\#60](https://github.com/DBCDK/hejmdal/pull/60) ([hrmoller](https://github.com/hrmoller))
- Dependencies mmj [\#59](https://github.com/DBCDK/hejmdal/pull/59) ([hrmoller](https://github.com/hrmoller))

## [0.1.0](https://github.com/DBCDK/hejmdal/tree/0.1.0) (2016-10-10)
**Fixed bugs:**

- Robots.txt er ikke aktiv [\#28](https://github.com/DBCDK/hejmdal/issues/28)
- \#28: Robots.txt er ikke aktiv [\#30](https://github.com/DBCDK/hejmdal/pull/30) ([hrmoller](https://github.com/hrmoller))

**Closed issues:**

- opret produktionsmiljø [\#14](https://github.com/DBCDK/hejmdal/issues/14)
- SessionStorage klassen skal kunne gemme i en postgress [\#47](https://github.com/DBCDK/hejmdal/issues/47)
- Hejmdal skal være baseret på koa@2 frem koa@1 [\#35](https://github.com/DBCDK/hejmdal/issues/35)
- npm lint:checkstyle [\#29](https://github.com/DBCDK/hejmdal/issues/29)
- Node version skal bumpes til 6.7 [\#23](https://github.com/DBCDK/hejmdal/issues/23)
- Logning [\#21](https://github.com/DBCDK/hejmdal/issues/21)
- Log ud [\#19](https://github.com/DBCDK/hejmdal/issues/19)
- integrationtestserver til login.bib.dk [\#12](https://github.com/DBCDK/hejmdal/issues/12)
- Endpoint: Hent ticket fra TicketStore [\#11](https://github.com/DBCDK/hejmdal/issues/11)
- TicketStore [\#7](https://github.com/DBCDK/hejmdal/issues/7)
- SessionStore [\#6](https://github.com/DBCDK/hejmdal/issues/6)
- Pipeline: eksterne services [\#2](https://github.com/DBCDK/hejmdal/issues/2)
- Opret basis node applikation [\#1](https://github.com/DBCDK/hejmdal/issues/1)

**Merged pull requests:**

- Changelog updated [\#58](https://github.com/DBCDK/hejmdal/pull/58) ([hrmoller](https://github.com/hrmoller))
- Changelog updated [\#56](https://github.com/DBCDK/hejmdal/pull/56) ([hrmoller](https://github.com/hrmoller))
- \#11: endpoint for getTicket - placed under login. [\#50](https://github.com/DBCDK/hejmdal/pull/50) ([fvsdbc](https://github.com/fvsdbc))
- \#5: use hash utils to generate and validate token [\#49](https://github.com/DBCDK/hejmdal/pull/49) ([fvsdbc](https://github.com/fvsdbc))
- \#7: some tests for hash util [\#48](https://github.com/DBCDK/hejmdal/pull/48) ([fvsdbc](https://github.com/fvsdbc))
- issue \#7: ticket component. First shot at functions [\#40](https://github.com/DBCDK/hejmdal/pull/40) ([fvsdbc](https://github.com/fvsdbc))
- \#5: setup for handling identityproviders [\#39](https://github.com/DBCDK/hejmdal/pull/39) ([vibjerg](https://github.com/vibjerg))
- issue \#1: move version prefix to root.routes [\#38](https://github.com/DBCDK/hejmdal/pull/38) ([fvsdbc](https://github.com/fvsdbc))
- Sandsynligt fix til knækkede CI tests [\#33](https://github.com/DBCDK/hejmdal/pull/33) ([hrmoller](https://github.com/hrmoller))
- issue \#1: Add version and headers \(cors and proxy\) [\#32](https://github.com/DBCDK/hejmdal/pull/32) ([fvsdbc](https://github.com/fvsdbc))
- \#23: Node version skal bumpes til 6.7 [\#24](https://github.com/DBCDK/hejmdal/pull/24) ([hrmoller](https://github.com/hrmoller))
- \#47: SessionStorage klassen skal kunne gemme i en postgress [\#51](https://github.com/DBCDK/hejmdal/pull/51) ([hrmoller](https://github.com/hrmoller))
- \#7: ticket ctx-driven. Minor change for hash.utils as add ticket to s… [\#44](https://github.com/DBCDK/hejmdal/pull/44) ([fvsdbc](https://github.com/fvsdbc))
- \#6: SessionStore [\#42](https://github.com/DBCDK/hejmdal/pull/42) ([hrmoller](https://github.com/hrmoller))
- Test was updated [\#37](https://github.com/DBCDK/hejmdal/pull/37) ([hrmoller](https://github.com/hrmoller))
- \#35: Hejmdal skal være baseret på koa@2 frem koa@1 [\#36](https://github.com/DBCDK/hejmdal/pull/36) ([hrmoller](https://github.com/hrmoller))
- \#29: npm lint:checkstyle [\#31](https://github.com/DBCDK/hejmdal/pull/31) ([hrmoller](https://github.com/hrmoller))
- Outputting process time in repsonse headers [\#27](https://github.com/DBCDK/hejmdal/pull/27) ([hrmoller](https://github.com/hrmoller))
- Tilføjede kommandoen ncu:check til check for opdateringer i dependenc… [\#26](https://github.com/DBCDK/hejmdal/pull/26) ([hrmoller](https://github.com/hrmoller))
- Fjernede nogle underlige karaktere [\#25](https://github.com/DBCDK/hejmdal/pull/25) ([hrmoller](https://github.com/hrmoller))
- eslint opgraderet til seneste version \(7.0.0\) [\#22](https://github.com/DBCDK/hejmdal/pull/22) ([hrmoller](https://github.com/hrmoller))
- \#1: Opret basis node applikation [\#20](https://github.com/DBCDK/hejmdal/pull/20) ([hrmoller](https://github.com/hrmoller))



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*