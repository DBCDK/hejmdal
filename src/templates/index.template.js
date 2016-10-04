/**
 * Main index template.
 *
 * @param title
 * @param content
 */

export default ({title, content}) => `
<html>
<head>
  <title>${title}</title>
</head>
<body>
  <div id="content">
    ${content}
  </div>
</body>
</html>
`;
