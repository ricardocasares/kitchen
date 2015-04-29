/**
 * Module dependencies
 */

var pool = require('../utils/mongoose-pool');
var Schema = require('mongoose').Schema;

/**
 * Project Schema
 * @type {Schema}
 */

var ProjectSchema = new Schema({
	name: {
		type: String,
    required: true
	},
	description: {
		type: String,
    required: true
	},
  people: [{ type: Schema.ObjectId, ref: 'User' }]
});

ProjectSchema.options.toJSON = {
  transform: function(doc, ret, options) {
    delete ret.__v;
    return ret;
  }
};
/**
 * Module exports
 */

module.exports = ProjectSchema;
