/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var errorHandler = require('./lib/middleware/errorHandler');
var accountHandler = require('./lib/middleware/accountHandler');
var tenantHandler = require('./lib/middleware/tenantHandler');
var auth = require('./lib/auth');
var api = require('./lib/api');

/**
 * Module variables
 */
module.exports = router;

/**
 * Middleware mounting
 */
router.use(accountHandler);
router.use(tenantHandler);
router.use(auth);
router.use('/api', api);

/**
 * Module routes
 */
router.get('/', express.static(__dirname + '/public'));
router.use(errorHandler);
