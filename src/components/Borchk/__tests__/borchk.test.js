import {CONFIG} from '../../../utils/config.util';
import {validateUserInLibrary} from '../borchk.component';
import {mockContext} from '../../../utils/test.util';

describe('Test borchk component', () => {
  // Save original config so it can be restored
  const _BORCHK_CONFIG = CONFIG.mock_externals.borchk;
  beforeEach(() => {
    CONFIG.mock_externals.borchk = true;
  });

  afterEach(() => {
    CONFIG.mock_externals.borchk = _BORCHK_CONFIG;
  });

  const ctx = mockContext();

  it('Lookup a known user', async () => {
    const user = {agency: '710100', userId: '1234567890', pincode: ''};
    const response = await validateUserInLibrary('login.bib.dk', user);
    expect(response.error).toBe(false);
    expect(response.message).toEqual('OK');
  });

  it('Lookup a unknown user', async () => {
    const user = {agency: '761500', userId: '1234567890', pincode: ''};
    const response = await validateUserInLibrary('login.bib.dk', user);
    expect(response.error).toBe(true);
    expect(response.message).toEqual('bonfd');
  });

  it('Lookup a known user in municipality', async () => {
    const user = {agency: '790900', userId: '0102032222', pincode: '1234'};
    const response = await validateUserInLibrary('login.bib.dk', user);
    expect(response.error).toBe(false);
    expect(response.message).toEqual('OK');
    expect(response.municipalityNumber).toEqual('909');
    expect(response.blocked).toEqual(false);
    expect(response.userPrivilege).toEqual([]);
  });
});
