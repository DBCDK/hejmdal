/**
 * @file
 * Add tests for utility funktions used for cas endpoints.
 */

import {CONFIG} from '../../utils/config.util';
import {createSingleLogoutUrl} from '../cas.routes';

describe('CAS utils test', () => {
  const _NODE_ENV = CONFIG.app.env;

  afterAll(() => {
    CONFIG.app.env = _NODE_ENV;
  });
  it('Should return logout url', () => {
    CONFIG.app.env = 'prod';
    const res = createSingleLogoutUrl(
      'http://bib000.bibbaser.dk/login?url=http://www.altavista.com'
    );
    expect(res).toBe('https://bib000.bibbaser.dk/logout');
  });
  it('Should return relavtive logout url during test', () => {
    CONFIG.app.env = 'test';
    const res = createSingleLogoutUrl(
      'http://bib000.bibbaser.dk/test?url=http://www.altavista.com'
    );
    expect(res).toBe('http://bib000.bibbaser.dk/test/logout');
  });
});
