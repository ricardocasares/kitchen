/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();

/**
 * Module exports
 */
module.exports = router;

/**
 * Routes setup
 */
router.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
