/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Project schema
 * @type {Schema}
 */
var ProjectSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
  people: [{ type: Schema.ObjectId, ref: 'User' }]
});

/**
 * Module exports
 */
module.exports = mongoose.model('Project', ProjectSchema);
