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
  name: {
    type: String
  },
  database: {
    type: String
  },
  limits: {
    users: Number,
    storage: Number,
    projects: Number
  }
});

/**
 * Module exports
 */
module.exports = mongoose.model('Account', AccountSchema);
