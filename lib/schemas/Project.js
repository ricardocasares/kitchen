/**
 * Module dependencies
 */

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
	}
});

/**
 * Module exports
 */

module.exports = ProjectSchema;
