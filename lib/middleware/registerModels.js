/**
 * Module dependencies
 */

var fs = require('fs');
var debug = require('debug')('app:middleware:registerModels');

/**
 * Module exports
 */

module.exports = registerModels;

/**
 * Module variables
 */

var models = [];
var path = __dirname + '/../schemas';

/**
 * Registers the models on the request mongoose database instance
 * @param  {Request}   req  Express request object
 * @param  {Response}  res  Express response object
 * @param  {Function}  next Callback
 */

function registerModels (req, res, next) {
	if(models[req.sub]) {
		debug('reusing models');
		req.m = models[req.sub];
	} else {
		var instanceModels = [];
		var schemas = fs.readdirSync(path);
		debug('registering models');
		schemas.forEach(function(schema) {
			var model = schema.split('.').shift();
			instanceModels[model] = req.db.model(model, require([path, schema].join('/')));
		});
		models[req.sub] = instanceModels;
		req.m = models[req.sub];
	}
	next();
}