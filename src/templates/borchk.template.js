/**
 * Template for borchk form.
 *
 */

export default () => `
<div id="borchk">
  <form action="/login" method="post">
    <h3>Log ind med Biblioteksnummer</h3>
    <input type="text" name="libraryId" placeholder="Biblioteksnummer"/>
    <input type="text" name="userId" placeholder="Bruger ID "/>
    <input type="text" name="userPass" placeholder="pinkode"/>
  </form>
</div>
`;
