/**
 * Template for nemlogin link.
 *
 */

import {VERSION_PREFIX} from '../../../utils/version.util';

export default (token) => `
<a href="${VERSION_PREFIX}/login/identityProviderCallback/nemlogin/${token}?eduPersonTargetedID=WAYF-DK-16028a572f83fd83cb0728aab8a6cc0685933a04">NEM-login</a>
`;
