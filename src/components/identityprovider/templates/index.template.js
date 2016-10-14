/**
 * Main index template.
 *
 * @param title
 * @param content
 */

export default function index({title, content}) {
  return `
<html>
<head>
  <title>${title}</title>
  <link rel="stylesheet" href="/main.css">
</head>
<body>
  <div id="content">
    ${content}
  </div>
</body>
</html>
`
};
