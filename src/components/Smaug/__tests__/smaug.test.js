import {CONFIG} from '../../../utils/config.util';
import * as smaug from '../smaug.component';

describe('Test Smaug component', () => {
  // Save original config so it can be restored
  const _SMAUG_CONFIG = CONFIG.mock_externals.smaug;

  beforeEach(() => {
    CONFIG.mock_externals.smaug = true;
  });

  afterEach(() => {
    CONFIG.mock_externals.smaug = _SMAUG_CONFIG;
  });

  it('should return client with valid client_id', async () => {
    const clientinfo = await smaug.getClientInfoByClientId('hejmdal');
    expect(clientinfo).toEqual({
      clientId: 'hejmdal',
      clientSecret: 'hejmdal_secret',
      grants: ['authorization_code', 'password', 'cas'],
      name: 'Test Service',
      identityProviders: ['nemlogin', 'borchk', 'unilogin', 'wayf'],
      requireConsent: false,
      logoColor: '#252525',
      redirectUris: [
        'http://localhost:3011/callback',
        'http://localhost:3011/example',
        'http://localhost:3011/example/provider/callback',
        'http://localhost:3011/example',
        'http://localhost:3011/cas/callback'
      ],
      logoutScreen: 'include',
      borchkServiceName: 'bibliotek.dk',
      attributes: {
        cpr: {name: 'CPR-nummer', description: 'Brugerens CPR-nummer'},
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
          description: '3 cifret kommunenummer'
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
        authenticatedToken: {
          skipConsent: true
        },
        uniqueId: {
          name: 'Bibliotekslogin id',
          description: 'Anonymiseret identifikation hos Bibliotekslogin'
        }
      },
      urls: {
        host: `http://localhost:${CONFIG.app.port}`,
        returnUrl: '/example/'
      }
    });
  });

  it('should not return client with invalid token', async () => {
    const clientinfo = await smaug.getClientInfoByClientId('invalid_client_id');
    expect(clientinfo).toBeNull();
  });
});
