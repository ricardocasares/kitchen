var cfg = require('./config');
var debug = require('debug')('app:lib:db');
var fs = require('fs');
var MongoosePool = require('./utils/mongoose-pool').MongoosePool;

exports.pool = MongoosePool({
  poolSize: cfg.mongo.poolSize,
  expiryPeriod: cfg.mongo.expiryPeriod,
  checkPeriod: cfg.mongo.checkPeriod
});
