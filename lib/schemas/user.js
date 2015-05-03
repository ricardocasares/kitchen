/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;

/**
 * User schema
 * @type {Schema}
 */
var UserSchema = new Schema({
  name: {type: String},
  email: {type: String, required: true},
  isOwner: {type: Boolean, default: false},
  isAdmin: {type: Boolean, default: false},
  isClient: {type: Boolean, default: false}
});

/**
 * Schema plugins
 */
UserSchema.plugin(findOrCreate);

/**
 * Module exports
 */
module.exports = mongoose.model('User', UserSchema);
