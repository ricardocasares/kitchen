/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var errorHandler = require('./lib/middleware/errorHandler');
var accountHandler = require('./lib/middleware/accountHandler');
var api = require('./lib/api');

/**
 * Module variables
 */
module.exports = router;

/**
 * Middleware mounting
 */
router.use(accountHandler);

/**
 * API Mount
 */
router.use('/api', api);

/**
 * SPA Mount
 */
router.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

/**
 * Error response handler
 */
router.use(errorHandler);
