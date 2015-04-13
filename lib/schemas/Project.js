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
		type: String
	},
	description: {
		type: String
	}
});

/**
 * Module exports
 */

module.exports = ProjectSchema;