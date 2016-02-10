/**
 * Module dependencies
 */
var debug = require('debug')('app:mongoose-pool');
var mongoose = require('mongoose');
var merge = require('lodash/object/merge');

/**
 * Module exports
 */
module.exports = exports = new MongoosePool();

/**
 * MongoosePool
 */
function MongoosePool() {

  /**
   * Interval reference
   */
  this.interval;
  
  /**
   * Connections cache object
   * @type {Object}
   */
  this.connections = {};
  
  /**
   * Mongoose connection states
   * @type {Object}
   */
  this.connectionStates = {
    disconnected: 0,
    connected: 1,
    connecting: 2,
    disconnectiong: 3
  };
  
  /**
   * Default options
   * @type {Object}
   */
  this.options = {
    url: 'mongodb://localhost:27017/',
    expiresAfter: 3600000,
    checkInterval: 1800000,
    mongodb: {}
  };
}

/**
 * Initializes the pool and starts monitoring connections
 * @param  {String} database Database name
 * @return {Object}          Connection object
 */
MongoosePool.prototype.config = function(config) {
  merge(this.options, config);
  clearInterval(this.interval);
  this.monitorConnections();
}

/**
 * Retrieves an existing connection or creates a new one
 * @param  {String} database Database name
 * @return {Object}          Connection object
 */
MongoosePool.prototype.getConnection = function(database) {
  var now = new Date();
  if(this.connections.hasOwnProperty(database)) {
    debug('reusing connection to', this.options.url + database);
    if(this.connections[database].conn.readyState === this.connectionStates.connected) {
      this.connections[database].last = now;  
      return this.connections[database];
    }
  }
  
  return this.createConnection(database);
}

/**
 * Creates a new connection
 * @param  {String} database Database name
 * @return {Object}          Connection object
 */
MongoosePool.prototype.createConnection = function(database) {
  var now = new Date();
  var url = this.options.url + database;

  debug('opening connection to', this.options.url + database);
  
  this.connections[database] = {
    url: url,
    conn: mongoose.createConnection(url, this.options.mongodb),
    last: now
  };

  return this.connections[database];
}

/**
 * Closes a database connection
 * @param  {String}   database Database name
 * @param  {Function} callback Callback
 * @return {Function}          Callback
 */
MongoosePool.prototype.closeConnection = function(database, callback) {
  if(this.connections[database]) {
    this.connections[database].conn.close(function(err) {
      if(err) {
        debug('Error closing connection to database: %s', database);
        return callback(err);
      }
      debug('Connection to %s closed, deleting from cache', database);
      delete this.connections[database];
      return callback(null);
    });   
  } else {
    return callback(new Error('Connection does not exists'));
  }
}

/**
 * Disconnects all connections
 * @param  {Function} callback Callback
 * @return {Function}          Callback
 */
MongoosePool.prototype.closeAllConnections = function(callback) {
  var cb = function(err) {
    if(err) {
      return callback(err);
    }
  };

  for (var db in this.connections) {
    this.closeConnection(db, cb);
  }

  return callback(null);
}

/**
 * Configures a connection check interval
 * @param  {Object} options Interval options
 */
MongoosePool.prototype.monitorConnections = function(options) {
  this.interval = setInterval(() => {
    debug('checking for expired connections');
    var now = new Date();
    for(var db in this.connections) {
      if (now - this.connections[db].last > this.options.expiresAfter) {
        debug('closing expired connection to', db);
        this.connections[db].conn.close();
        delete this.connections[db];
      }
    }
  }, this.options.checkInterval);
}
