/**
 * Module dependencies
 */
var express = require('express');

/**
 * Module variables
 */

var app = express();
var errors = require('./lib/errors');
var dbInstance = require('./lib/middleware/dbInstance');
var registerModels = require('./lib/middleware/registerModels');
var populateAccount = require('./lib/middleware/populateAccount');
var errorHandler = require('./lib/middleware/errorHandler');

/**
 * Setup middleware
 */

app.use(dbInstance);
app.use(registerModels);
app.use(populateAccount);

app.get('/', function(req, res, next) {
	req.m.Project.find({},function(err, pets) {
		if(err) {
			next(err);
		}
		res.json({ count: pets.length, data: pets, test: req.test });
	});
});

app.get('/create', function (req, res, next) {
	var limit = req.account.projects;
	req.m.Project.count({}, function (err, count) {
		if(err) {
			console.log(err);
		}
		if(count >= limit) {
			return next(new errors.ForbiddenError('Project limits reached'));
		} else {
			next();
		}
	});
});

app.get('/create', function (req, res) {
	var p = new req.m.Project({ name: 'test', description: 'descw' });
	p.save(function(err, pet) {
		res.json(pet);
	});
});

app.use(errorHandler);

app.listen(8000);
