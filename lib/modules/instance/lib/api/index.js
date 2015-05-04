/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var projects = require('./projects');
var auth = require('../auth');

/**
 * Module exports
 */
module.exports = router;

/**
 * Module mounting
 */
router.use('/', auth);
router.use('/projects', projects);
router.use('/', function(req, res) {
  res.json({version: '0.0.1'});
});
