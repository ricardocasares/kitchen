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
  projects: {
    type: Number
  }
});

/**
 * Module exports
 */

module.exports = AccountSchema;
