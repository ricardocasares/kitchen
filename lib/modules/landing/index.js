/**
 * Module dependencies
 */

var express = require('express');
var router = express.Router();

/**
 * Module exports
 */

module.exports = router;

router.get('*', express.static(__dirname + '/public'));
