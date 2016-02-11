/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Account schema
 * @type {Schema}
 */
var AccountSchema = new Schema({
  name: {type: String},
  hostname: {type: String},
  mongo: {
    uri: {type: String},
    options: {
      database: {type: String}
    }
  },
  limits: {
    users: {type: Number},
    storage: {type: Number},
    projects: {type: Number}
  }
});

/**
 * Module exports
 */
module.exports = mongoose.model('Account', AccountSchema);
