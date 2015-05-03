/**
 * Module exports
 */
module.exports = {
  mongo: {
    url: 'mongodb://localhost:27017/',
    db: 'kitchen',
    options: {
      server: {
        poolSize: 4
      }
    },
    expiresAfter: 3600000,
    checkInterval: 1800000
  },
  port: process.env.PORT || 3000,
  secret: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
  domain: 'local.dev' || process.env.DOMAIN,
  subdomains: '*.local.dev' || process.env.SUBDOMAINS
};
