/**
 * @file
 *
 * Describe the attributes supported by hejmdal.
 *
 * Each service specified in Smaug, can ask for one or more of these attributes.
 * The values of the attributes are fetched from CULR and/or the IDP
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
  municipalityAgencyId: {},
  uniLoginInstitutions: {
    name: 'List of unilogin institutions a user is connected to'
  }
};
