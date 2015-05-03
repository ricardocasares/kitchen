/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var projects = require('./projects');

/**
 * Module exports
 */
module.exports = router;

/**
 * Module mounting
 */
router.use('/projects', projects);
