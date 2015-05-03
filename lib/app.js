/**
 * Module dependencies
 */

var debug = require('debug')('app');
var cfg = require('./config');
var express = require('express');
var session = require('express-session');
var modules = require('./modules');
var pool = require('./utils/mongoose-pool');

/**
 * Pool configuration
 */
pool.config({
  expiresAfter: cfg.mongo.expiresAfter,
  checkInterval: cfg.mongo.checkInterval,
  mongodb: cfg.mongo.options
});

/**
 * Module variables
 */
var server;
var app = express();
var db = pool.getConnection(cfg.mongo.db);

/**
 * Register mongoose schemas
 */
require('./schemas');

/**
 * Middleware
 */
app.use(session({
  secret: cfg.secret,
  resave: false,
  saveUninitialized: false
}));

/**
 * Module mounting
 */
app.use(modules);

db.conn.on('error', function() {
  throw new Error('Could not open connection to MongoDB');
});

db.conn.on('connected', function() {
  debug('connected to MongoDB, starting app ...');
  server = app.listen(cfg.port, function() {
    debug('app started, listening on port', cfg.port);
  });

  var gracefulExit = function() {
    debug('user terminated the process');
    pool.closeAllConnections(function() {
      debug('all connections closed! goodbye!');
      server.close();
      process.exit(0);
    });
  };

  process
    .on('SIGINT', gracefulExit)
    .on('SIGTERM', gracefulExit);
});
