/**
 * Module dependencies
 */

var debug = require('debug')('app');
var cfg = require('./config');
var express = require('express');
var vhost = require('vhost');
var session = require('express-session');
var landing = require('./modules/landing');
var instance = require('./modules/instance');
var pool = require('./utils/mongoose-pool');

pool.init({
  mongodb: cfg.mongo.options
});

/**
 * Module variables
 */

var app = express();
var db = pool.getConnection(cfg.mongo.db);

/**
 * Middleware mounting
 */

app.use(session({
  secret: cfg.secret,
  resave: false,
  saveUninitialized: false
}));

/**
 * Module mounting
 */

app.use(vhost(cfg.domain, landing));
app.use(vhost('www.' + cfg.domain, landing));
app.use(vhost(cfg.subdomains, instance));

db.conn.on('error', function(){
  debug('could not open connection to', db.name);
});

db.conn.on('connected', function() {
  debug('connected to MongoDB, starting app ...');
  app.listen(cfg.port, function() {
    debug('started! listening on port', cfg.port);
  });
});
