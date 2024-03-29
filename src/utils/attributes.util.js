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
  forsrights: {
    name: 'FORS-like Rights for agency',
    description: 'FORS-like produktrettigheder for det aktuelle agency'
  },
  dbcidp: {
    name: 'Rights for agency',
    description: 'Produktrettigheder for det aktuelle agency'
  },
  dbcidpUniqueId: {
    name: 'dbcidp unique id',
    description: 'unique id for user in dbcidp'
  },
  dbcidpUserInfo: {
    name: 'dbcidp user info',
    description: 'user info in dbcidp, name, email and phone'
  },
  dbcidpRoles: {
    name: 'dbcidp user roles',
    description: 'user roles in dbcidp'
  },
  blocked: {},
  userPrivilege: {},
  idpUsed: {
    name: 'Valgt IDP',
    description: 'Navn på den IDP der er logget ind med'
  },
  municipalityAgencyId: {},
  municipalityAgencyRights: {
    name: 'produkter i DBCIDP',
    description: 'Liste (array) af produkter som ønskes tjekket i DBCIDP for hjemhørs agency'
  },
  agencyRights: {
    name: 'produkter i DBCIDP',
    description: 'Liste (array) af produkter som ønskes tjekket i DBCIDP for det aktuelle agency'
  },
  tokenUser: {
    name: 'Bruger data indeholdt i tokenet',
    description: 'De bruger data der er indeholdt i tokenet. Bør kun udstilles til fortrolige klienter'
  },
  uniloginUniId: {
    name: 'Brugerens unilogin ID',
    description: 'Udleveret fra OIDC unilogin parameteren uniid'
  },
  uniloginUserType: {
    name: 'Brugerens unilogin type',
    description: 'Udleveret fra OIDC unilogin parameteren aktoer_gruppe'
  },
  uniloginHasLicense: {
    name: 'Brugerens licensforhold (boolean)',
    description: 'Udleveret fra OIDC unilogin parameteren has_license'
  },
  uniloginInstitutionIds: {
    name: 'Brugerens institutioner (array af ids eller null)',
    description: 'Udleveret fra OIDC unilogin parameteren institution_ids'
  },
  uniLoginInstitutions: {
    name: 'List of unilogin institutions a user is connected to'
  }
};
