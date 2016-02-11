/**
 * Module dependencies
 */
var debug    = require('debug')('app:mongoose-manager');
var crypto   = require('crypto');
var mongoose = require('mongoose');

/**
 * Module exports
 */
module.exports = exports = new MongooseManager;

/**
 * MongooseManager
 */
function MongooseManager() {

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
    expiresAfter: 3600000,
    checkInterval: 1800000,
    mongodb: {}
  }
}

/**
 * Initializes and monitors the pool
 * 
 * @param  {Object} pool configuration
 */
MongooseManager.prototype.config = function(options) {
  Object.assign(this.options, options);
  this.monitorConnections();
}

/**
 * Retrieves an existing connection or creates a new one
 * 
 * @param  {String} database Database name
 * @return {Object}          Connection object
 */
MongooseManager.prototype.getConnection = function(mongo) {
  var connHash = this.getConnectionHash(mongo);
  if(this.connections.hasOwnProperty(connHash)) {
    var ready = this.connectionStates.connected;
    var state = this.connections[connHash].conn.readyState;
    if(state === ready) {
      debug('reusing connection hash:', connHash);
      this.connections[connHash].last = new Date();
      return this.connections[connHash];
    }
  }
  
  return this.createConnection(mongo);
}

/**
 * Creates a new connection
 * 
 * @param  {String} database Database name
 * @return {Object}          Connection object
 */
MongooseManager.prototype.createConnection = function(mongo) {
  var connHash = this.getConnectionHash(mongo);
  this.connections[connHash] = {
    last: new Date(),
    conn: mongoose.createConnection(mongo.uri, mongo.options),
  };

  return this.connections[connHash];
}

/**
 * Closes a database connection
 * 
 * @param  {String}   database Database name
 * @param  {Function} callback Callback
 * @return {Function}          Callback
 */
MongooseManager.prototype.closeConnection = function(connHash, callback) {
  if(this.connections[connHash]) {
    var mongo = this.connections[connHash];
    mongo.conn.close(function(err) {
      if(err) {
        debug('Error closing connection to database hashed: %s', connHash);
        return callback(err);
      }
      debug('Connection to %s closed, deleting from cache', connHash);
      delete this.connections[connHash];
      return callback(null);
    });   
  } else {
    debug('Skipping, connection %s was already closed', connHash);
    return callback(null);
  }
}

/**
 * Disconnects all connections
 * 
 * @param  {Function} callback Callback
 * @return {Function}          Callback
 */
MongooseManager.prototype.closeAllConnections = function(callback) {
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
 * 
 * @param  {Object} options Interval options
 */
MongooseManager.prototype.monitorConnections = function(options) {
  clearInterval(this.interval);
  this.interval = setInterval(() => {
    debug('checking for expired connections');
    var now = new Date();
    for(var hash in this.connections) {
      if (now - this.connections[hash].last > this.options.expiresAfter) {
        debug('closing expired connection to', hash);
        this.connections[hash].conn.close();
        delete this.connections[hash];
      }
    }
  }, this.options.checkInterval);
}

/**
 * Returns a connection string based on a
 * mongo configuration object
 * 
 * @param  {Object} mongo  Mongodb confiuration object
 * @return {String}          Connection string
 */
MongooseManager.prototype.getConnectionHash = function(mongo) {
  return crypto
    .createHash('md5')
    .update(mongo.uri)
    .digest('hex');
}
