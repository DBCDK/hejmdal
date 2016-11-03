const path = require('path');

browser.getSession = () => {
  const sessionString = browser.element('#dump-session').getText();
  return JSON.parse(sessionString);
};

browser.getState = () => {
  const sessionString = browser.element('#dump-session').getText();
  return JSON.parse(sessionString).state;
};

browser.getTicketOnExamplePage = () => {
  const sessionString = browser.element('#ticket').getText();
  return JSON.parse(sessionString);
};

browser.screendump = (name, where) => {

  const filename = name || Date.now();
  const filepath = where || './selenium/';

  const fullpath = path.join(filepath, filename + '.png');
  console.log(fullpath);
  console.log(path.resolve(fullpath));
  browser.saveScreenshot(fullpath);
};
