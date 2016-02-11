var cfg = require('../config');
var debug = require('debug')('app:sessions:mongo');
var manager = require('../utils/mongoose-manager');
var db = manager.getConnection(cfg.mongo);

module.exports = function(session) {
  debug('initializing mongodb session store');
  var MongoStore = require('connect-mongo')(session);
  return new MongoStore(Object.assign(cfg.app.sessions.mongo, { mongooseConnection: db.conn }));
}
