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

  it('Lookup a known user', () => {
    const user = {libraryId: '710100', userId: '1234567890', pincode: ''};
    return validateUserInLibrary(ctx, user).then((result) => {
      assert.isTrue(result);
    });
  });

  it('Lookup a unknown user', () => {
    const user = {libraryId: '761500', userId: '1234567890', pincode: ''};
    return validateUserInLibrary(ctx, user).then((result) => {
      assert.isFalse(result);
    });
  });

/* call to external service
  it('Lookup a unknown user', () => {
    CONFIG.mock_externals.borchk = false;
    ctx.setState({user: {library: '710100', userId: '1234567890', pinCode: '9876'}});
    return validateUserInLibrary(ctx, next).then(() => {
      assert.isFalse(ctx.getState().user.userValidate);
    });
  });
*/

});
