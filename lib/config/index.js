/**
 * Module exports
 */
module.exports = {
  app: {
    port: process.env.PORT || 3000,
    secret: process.env.SECRET || 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
    domain: process.env.DOMAIN || 'local.dev',
    subdomains: process.env.SUBDOMAINS || '*.local.dev',
    sessions: {
      // choose one, mongo or redis
      store: process.env.APP_SESS_STORE || 'mongo',
      // please read https://www.npmjs.com/package/connect-mongo
      mongo: {
        autoremove: process.env.APP_SESS_MONGO_AUTOREMOVE || 'enabled',
        collection: process.env.APP_SESS_MONGO_COLLECTION || 'sessions',
        touchAfter: process.env.APP_SESS_MONGO_TOUCHAFTER || 24 * 3600
      },
      // please read https://www.npmjs.com/package/connect-redis
      redis: {
        url: process.env.APP_SESS_REDIS_URL || 'redis://127.0.0.1:6379/0',
        unref: process.env.APP_SESS_REDIS_UNREF || false,
        prefix: process.env.APP_SESS_REDIS_PREFIX || 'sess:',
      }
    } 
  },
  mongo: {
    // mongodb full uri
    uri: process.env.MONGO_URL || 'mongodb://localhost:27017/kitchen',
    // mongodb options
    options: {
      server: {
        poolSize: process.env.MONGO_OPT_SERVER_POOL_SIZE || 1
      }
    },
    // connections to db expires after
    expiresAfter: process.env.MONGO_OPT_POOL_EXPIRE || 13600000,
    // connections cache check interval
    checkInterval: process.env.MONGO_OPT_POOL_CHECK || 1800000
  }
};
