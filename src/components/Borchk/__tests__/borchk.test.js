import {assert} from 'chai';
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
    const user = {libraryId: '710100', userId: '1234567890', pincode: ''};
    const response = await validateUserInLibrary(ctx, user);
    assert.isFalse(response.error);
    assert.equal(response.message, 'OK');
  });

  it('Lookup a unknown user', async () => {
    const user = {libraryId: '761500', userId: '1234567890', pincode: ''};
    const response = await validateUserInLibrary(ctx, user);
    assert.isTrue(response.error);
    assert.equal(response.message, 'Unknown error');
  });
});
