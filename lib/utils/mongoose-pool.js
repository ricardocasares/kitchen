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
  var interval;
  
  /**
   * Connections cache object
   * @type {Object}
   */
  var connections = {};
  
  /**
   * Mongoose connection states
   * @type {Object}
   */
  var connectionStates = {
    disconnected: 0,
    connected: 1,
    connecting: 2,
    disconnectiong: 3
  };
  
  /**
   * Default options
   * @type {Object}
   */
  var options = {
    url: 'mongodb://localhost:27017/',
    expiresAfter: 3600000,
    checkInterval: 1800000,
    mongodb: {}
  };

  /**
   * Initialize with default options
   */
  config(options);

  return {
    config: config,
    getConnection: getConnection,
    closeConnection: closeConnection,
    closeAllConnections: closeAllConnections
  };

  /**
   * Configures and initializes mongoose pool
   * @param  {Object} opts Options object
   */
  function config(opts) {
    merge(options, opts);
    configureInterval(options);
  }

  /**
   * Retrieves an existing connection or creates a new one
   * @param  {String} database Database name
   * @return {Object}          Connection object
   */
  function getConnection(database) {
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

  /**
   * Creates a new connection
   * @param  {String} database Database name
   * @return {Object}          Connection object
   */
  function createConnection(database) {
    var now = new Date();
    var url = options.url + database;

    debug('opening connection to', options.url + database);
    
    connections[database] = {
      url: url,
      conn: mongoose.createConnection(url, options.mongodb),
      last: now
    };

    return connections[database];
  }

  /**
   * Closes a database connection
   * @param  {String}   database Database name
   * @param  {Function} callback Callback
   * @return {Function}          Callback
   */
  function closeConnection(database, callback) {
    if(connections[database]) {
      connections[database].conn.close(function(err) {
        if(err) {
          debug('Error closing connection to database: %s', database);
          return callback(err);
        }
        debug('Connection to %s closed, deleting from cache', database);
        delete connections[database];
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
  function closeAllConnections(callback) {
    var cb = function(err) {
      if(err) {
        return callback(err);
      }
    };

    for (var db in connections) {
      closeConnection(db, cb);
    }

    return callback(null);
  }

  /**
   * Configures a connection check interval
   * @param  {Object} options Interval options
   */
  function configureInterval(options) {
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
