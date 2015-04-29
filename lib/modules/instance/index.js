/**
 * Module dependencies
 */

var express = require('express');
var router = express.Router();
var errorHandler = require('./lib/middleware/errorHandler');
var accountHandler = require('./lib/middleware/accountHandler');
var tenantHandler = require('./lib/middleware/tenantHandler');
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

/**
 * Module mounting
 */

router.use('/api', api);

/**
 * Serve client
 */

router.get('/', express.static(__dirname + '/public'));

router.use(errorHandler);
