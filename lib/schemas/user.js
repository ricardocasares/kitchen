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
UserSchema.options.toJSON = {
  transform: function(userDoc) {
    var doc = userDoc.toJSON({transform: false});
    delete doc.isOwner;
    delete doc.isAdmin;
    delete doc.isClient;
    delete doc.__v;
    return doc;
  }
};

/**
 * Module exports
 */
module.exports = mongoose.model('User', UserSchema);
