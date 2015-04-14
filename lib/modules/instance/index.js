/**
 * Module dependencies
 */

var debug = require('debug')('app:modules:instance');
var express = require('express');
var router = express.Router();
var populateAccount = require('./lib/middleware/populateAccount');
var dbInstance = require('./lib/middleware/dbInstance');
var registerModels = require('./lib/middleware/registerModels');
var errorHandler = require('./lib/middleware/errorHandler');
var api = require('./lib/api');

/**
 * Module variables
 */

module.exports = router;

/**
 * Middleware mounting
 */

router.use(populateAccount);
router.use(dbInstance);
router.use(registerModels);

/**
 * Module mounting
 */

debug('mounting API modules');
router.use('/api', api);

/**
 * Serve client
 */

router.get('/', express.static(__dirname + '/public'));

router.use(errorHandler);

