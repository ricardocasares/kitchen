var _ = require('lodash');
var debug = require('debug')('mongoose-pool');
var mongoose = require('mongoose');

var MongoosePool = function MongoosePool () {
  var interval;
  var connections = {};
  var options = {
    url: 'mongodb://localhost:27017/',
    expiresAfter: 3600000,
    checkInterval: 1800000,
    mongodb: {}
  };

  this.init = function (opts) {
    _.extend(options, opts);
    clearInterval(interval);
    this.configureInterval();
  };

  this.getConnection = function(database) {
    var now = new Date();
    if(connections.hasOwnProperty(database)) {
      debug('reusing connection to', options.url, database);
      connections[database].last = now;
      return connections[database];
    }
    
    debug('opening connection to', options.url + database);
    
    var url = options.url + database;
    connections[database] = {
      url: url,
      conn: mongoose.createConnection(url, options.mongodb),
      last: now
    };
    
    return connections[database];
  };

  this.configureInterval = function() {
    interval = setInterval(function() {
        debug(options.expiresAfter);
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
  };

  this.init(options);
};

MongoosePool._instance = null;

MongoosePool.getInstance = function () {
  if (this._instance === null) {
    this._instance = new MongoosePool();
  }
  return this._instance;
};

module.exports = MongoosePool.getInstance();
