var cfg = require('../config');
var debug = require('debug')('app:sessions:redis');

module.exports = function(session) {
  debug('initializing redis session store');
  var RedisStore = require('connect-redis')(session);
  return new RedisStore(cfg.app.sessions.redis);
}
