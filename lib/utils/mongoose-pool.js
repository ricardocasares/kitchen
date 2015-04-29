var _ = require('lodash');
var debug = require('debug')('app:mongoose-pool');
var requireDir = require('require-dir');
var mongoose = require('mongoose');

function MongoosePool () {
  
  var interval,
      connections = {},
      connectionStates = {
        disconnected: 0,
        connected: 1,
        connecting: 2,
        disconnectiong: 3
      },
      options = {
        url: 'mongodb://localhost:27017/',
        expiresAfter: 3600000,
        checkInterval: 1800000,
        mongodb: {}
      };

  init(options);

  return {
    init: init,
    getConnection: getConnection,
    closeConnection: closeConnection,
    closeAllConnections: closeAllConnections
  };

  function init (opts) {
    _.extend(options, opts);
    clearInterval(interval);
    configureInterval(options);
  }

  function getConnection (database) {
    var now = new Date();
    if(connections.hasOwnProperty(database)) {
      debug('reusing connection to', options.url + database);
      if(connections[database].conn.readyState === connectionStates.connected) {
        connections[database].last = now;  
        return connections[database];
      }
    }
    
    return createConnection(database);
  }

  function createConnection(database) {
    var now = new Date();
    var url = options.url + database;

    debug('opening connection to', options.url + database);
    
    connections[database] = {
      url: url,
      conn: mongoose.createConnection(url, options.mongodb),
      last: now
    };
    registerSchemas(connections[database]);
    return connections[database];
  }

  function registerSchemas(db) {
    db.models = {};
    var schemas = requireDir('../schemas');
    for (var schema in schemas) {
      model = schema
        .charAt(0)
        .toUpperCase()
        .concat(schema.substr(1).toLowerCase());
      db.models[model] = db.conn.model(model, schemas[schema]);
    }
  }

  function closeConnection(database, cb) {
    if(connections.hasOwnProperty(database)) {
      try {
        connections[database].conn.close(function() {
          delete connections[database];
          return cb(null);
        });  
      } catch (err) {
        cb(new Error('Connection does not exists'));   
      }     
    }
  }

  function closeAllConnections (cb) {
    debug('closing all database connections');
    try {
      for (var db in connections) {
        connections[db].conn.close(removeConnection(db));
      }
      connections = {};
      return cb(null);
    } catch (err) {
      cb(err);
    }
  }

  function removeConnection(conn) {
    debug(conn);
    delete connections[conn];
  }

  function configureInterval (options) {
    interval = setInterval(function() {
        debug('checking for expired connections');
        var now = new Date();
        for(var db in connections) {
          if (now - connections[db].last > options.expiresAfter) {
            debug('closing expired connection to', db);
            connections[db].conn.close();
            delete connections[db];
          }
        }
      }, options.checkInterval);
  }
}

module.exports = exports = new MongoosePool();
