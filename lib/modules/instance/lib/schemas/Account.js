/**
 * Module dependencies
 */

var Schema = require('mongoose').Schema;

/**
 * Project Schema
 * @type {Schema}
 */

var AccountSchema = new Schema({
  name: {
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

module.exports = AccountSchema;
