/**
 * Template for borchk form.
 *
 */

import {VERSION_PREFIX} from '../../../utils/version.util';

export default (token) => `
<div id="borchk">
  <form action="${VERSION_PREFIX}/login/identityProviderCallback/borchk/${token}" method="post">
    <h3>Log ind med Biblioteksnummer</h3>
    <input type="text" name="libraryId" placeholder="Biblioteksnummer"/>
    <input type="text" name="userId" placeholder="Bruger ID "/>
    <input type="password" name="pincode" placeholder="pinkode"/>
    <input type="submit" value="borchk">
  </form>
</div>
`;
