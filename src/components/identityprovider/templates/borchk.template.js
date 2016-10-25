/**
 * Template for borchk form.
 *
 */

export default (version, token) => `
<div id="borchk">
  <form action="${version}/login/identityProviderCallback/borchk/${token}" method="get">
    <h3>Log ind med Biblioteksnummer</h3>
    <input type="text" name="libraryId" placeholder="Biblioteksnummer"/>
    <input type="text" name="userId" placeholder="Bruger ID "/>
    <input type="text" name="pincode" placeholder="pinkode"/>
    <input type="submit" value="borchk">
  </form>
</div>
`;
