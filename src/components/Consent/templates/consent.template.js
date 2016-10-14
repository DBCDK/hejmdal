/**
 * Main index template.
 *
 * @param {string} service Name of service
 */

export default ({service}) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Tilladelse til udveksling af data</title>
    <link rel="stylesheet" href="/main.css">
  </head>
  <body>
    <div id="content">
        Vil du dele alt med ${service}
        <div>
          <form action="/v0/login/consentsubmit" method="post">
            <button type="submit" value="1" name="userconsent" >Acceptér</button>
            <button type="submit" value="0" name="userconsent" >Afvis</button>
          </form>
        </div>
      </div>
  </body>
</html>
`;
