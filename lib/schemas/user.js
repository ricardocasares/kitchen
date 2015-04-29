var Schema = require('mongoose').Schema;

/**
 * Project Schema
 * @type {Schema}
 */

var UserSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

/**
 * Module exports
 */

module.exports = UserSchema;
