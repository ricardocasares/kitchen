/**
 * Module dependencies
 */

var express = require('express');
var vhost = require('vhost');
var session = require('express-session');
var config = require('./config');
var landing = require('./modules/landing');
var instance = require('./modules/instance');

/**
 * Module variables
 */

var app = express();

/**
 * Middleware mounting
 */

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false
}));

/**
 * Module mounting
 */

app.use(vhost(config.domain, landing));
app.use(vhost('www.' + config.domain, landing));
app.use(vhost(config.subdomains, instance));

app.listen(config.port);
