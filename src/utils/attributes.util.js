/**
 * @file
 *
 * Describe the attributes supported by hejmdal.
 *
 * Each service specified in Smaug, can ask for one or more of these attributes.
 * The values of the attributes are fetched from CULR and DBCIDP and/or the chosen IDP
 *
 */

export const ATTRIBUTES = {
  cpr: {
    name: 'CPR-nummer',
    description: 'Brugerens CPR-nummer'
  },
  birthDate: {
    name: 'Fødselsdato',
    description: 'Fødselsdato - 4 første cifre af CPR-nummer'
  },
  birthYear: {
    name: 'Fødselsår',
    description: '4 cifret fødselsår - taget fra CPR-nummer'
  },
  gender: {
    name: 'Køn',
    description: 'Brugerens køn, m (for male) eller f (for female)'
  },
  allLibraries: {
    name: 'Biblioteker',
    description: 'En liste over de biblioteker som kender brugeren inklusiv interne biblioteker'
  },
  libraries: {
    name: 'Biblioteker',
    description: 'En liste over de biblioteker som kender brugeren'
  },
  municipality: {
    name: 'Kommunenummer',
    description: '3 cifret kommunenummer' // http://www.linking.dk/lokalportaler/kommuner.html
  },
  uniloginId: {
    name: 'UNI-login brugernavn',
    description: 'Brugerens identifikation hos UNI-Login'
  },
  userId: {
    name: 'Biblioteks bruger-id',
    description: 'Brugerens identitet på biblioteket - oftest CPR-nummer'
  },
  wayfId: {
    name: 'WAYF id',
    description: 'Brugerens identifikation hos WAYF'
  },
  uniqueId: {
    name: 'Bibliotekslogin id',
    description: 'Anonymiseret identifikation hos Bibliotekslogin'
  },
  authenticatedToken: {
    skipConsent: true
  },
  netpunktAgency: {},
  forsrights: {},
  dbcidp: {
      name: 'Valgt IDP',
      description: 'Navn på den IDP der er logget ind med'
  },
  blocked: {},
  userPrivilege: {},
  idpUsed: {},
  municipalityAgencyId: {},
  municipalityAgencyRights: {
    name: 'produkter i DBCIDP',
    description: 'Liste (array) af produkter som ønskes tjekket i DBCIDP for hjemhørs agency'
  },
  agencyRights: {
    name: 'produkter i DBCIDP',
    description: 'Liste (array) af produkter som ønskes tjekket i DBCIDP for det aktuelle agency'
  },
  uniLoginInstitutions: {
    name: 'List of unilogin institutions a user is connected to'
  }
};
