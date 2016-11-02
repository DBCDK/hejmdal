/**
 * Main index template.
 *
 * @param {string} service Name of service
 */

export default ({attributes, versionPrefix, service}) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <title>Tilladelse til udveksling af data</title>
    <link rel="stylesheet" href="/main.css">
  </head>
  <body>
    <div id="content">
      Ved tryk på Acceptér, accepterer du at dele nedenstående informationer med ${service}
      <ul id="consent-attributes">
        ${renderAttributes(attributes)}
      </ul>
      <div id="consent-actions">
        <form action="${versionPrefix}/login/consentsubmit" method="post">
          <button id="consent-actions-accept" type="submit" value="1" name="userconsent">Acceptér</button>
          <button id="consent-actions-reject" type="submit" value="0" name="userconsent">Afvis</button>
        </form>
      </div>
      </div>
  </body>
</html>
`;
};

function renderAttributes(attributes) {
  let str = '';
  const keys = Object.keys(attributes);

  keys.forEach((key) => {
    const attribute = attributes[key];
    str += `<li>${attribute.name}</li>`;
  });

  return str;
}
