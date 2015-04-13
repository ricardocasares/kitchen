/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var debug = require('debug')('app:middleware:dbInstance');

/**
 * Module exports
 */

module.exports = dbInstance; 

/**
 * Module variables
 */

var conns = [];

/**
 * Opens or reuse a database connection based on subdomain
 * @param  {Request}   req  Express request object
 * @param  {Response}  res  Express response object
 * @param  {Function}  next Callback
 */

function dbInstance (req, res, next) {

	var sub = req.sub = req.subdomains[0] || 'app';

	if (conns[sub]) {
		debug('reusing connection', sub, '...');
		req.db = conns[sub];
	} else {
		debug('creating new connection to', sub, '...');
		conns[sub] = mongoose.createConnection('mongodb://localhost:27017/' + sub);
		req.db = conns[sub];
	}
	next();
}