/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var errorHandler = require('./middleware/errorHandler');
var accountHandler = require('./middleware/accountHandler');
var api = require('./api');

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
