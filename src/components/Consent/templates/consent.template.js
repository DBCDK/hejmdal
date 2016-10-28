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
      Ved tryk på Acceptér, acceptere du at dele nedenståene informationer med ${service}
      <ul>
        ${renderAttributes(attributes)}
      </ul>
      <div>
        <form action="${versionPrefix}/login/consentsubmit" method="post">
          <button type="submit" value="1" name="userconsent" >Acceptér</button>
          <button type="submit" value="0" name="userconsent" >Afvis</button>
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
