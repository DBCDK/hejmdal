/**
 * @file
 * Configure and start oAuth2 hejmdal server
 */

var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');

import model from './oAuth2/oAuth2.memory.model';
console.log(model);

var app = express();

app.oauth = new OAuthServer({
  model: model // See https://github.com/oauthjs/node-oauth2-server for specification
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(app.oauth.authorize());

app.use(function(req, res) {
  res.send('Secret area');
});

module.exports = app;
app.listen(3000);
