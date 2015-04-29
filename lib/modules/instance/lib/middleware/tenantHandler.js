var pool = require.main.require('../lib/utils/mongoose-pool');

module.exports = tenantHandler;

function tenantHandler (req, res, next) {
  var db = pool.getConnection(req.vhost[0]);
  req.db = db.models;
  next();
}
