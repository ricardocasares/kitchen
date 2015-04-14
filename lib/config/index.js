/**
 * Module exports
 */
module.exports = {
  mongo: {
    db: 'kitchen',
    host: 'localhost',
    port: '27017'
  },
  port: process.env.PORT || 3000,
  secret: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
  domain: 'local.dev' || process.env.DOMAIN,
  subdomains: '*.local.dev' || process.env.SUBDOMAINS
};
