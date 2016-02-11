/**
 * Module dependencies
 */
var path = require('path');
var debug = require('debug')('app');
var cfg = require('./config');
var express = require('express');
var session = require('express-session');
var modules = require('./modules');
var manager = require('./utils/mongoose-manager');

/**
 * MongooseManager configuration
 */
manager.config(cfg.mongo);

/**
 * Module variables
 */
var server;
var app = express();
var db = manager.getConnection(cfg.mongo);
var store = [
  '.',
  'sessions',
  cfg.app.sessions.store
].join(path.sep);

/**
 * Register mongoose schemas
 */
require('./schemas');

/**
 * Middleware
 */
app.use(session({
  secret: cfg.app.secret,
  resave: true,
  saveUninitialized: false,
  store: require(store)(session)
}));

/**
 * Module mounting
 */
app.use(modules);

db.conn.on('error', function() {
  throw new Error('Could not open connection to MongoDB');
});

db.conn.on('connected', function() {
  debug('database connected, starting server...');
  server = app.listen(cfg.app.port, function() {
    debug('server listening on http://%s:%s', cfg.app.domain, cfg.app.port);
  });

  var gracefulExit = function() {
    debug('process interrupted');
    manager.closeAllConnections(function(err) {
      if(err) {
        debug('an error occured trying to close all connections');
      }
      server.close(function(err) {
        debug('server is shutting down...');
        if(err) {
          debug('could not close server clean');
          process.exit(1);
        }
        process.exit(0);
      });
    });
  };

  server.on('error', (e) => {
    if (e.code == 'EADDRINUSE') {
      console.log('Address in use, retrying...');
      setTimeout(() => {
        server.close();
        server.listen(cfg.port);
      }, 1000);
    }
  });

  process
    .on('SIGINT', gracefulExit)
    .on('SIGTERM', gracefulExit);
});
