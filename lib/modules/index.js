/**
 * Module dependencies
 */

var cfg = require('../config');
var router = require('express').Router();
var vhost = require('vhost');
var landing = require('./landing');
var instance = require('./instance');

/**
 * Module exports
 */

module.exports = router;

/**
 * Module mountings
 */

router.use(vhost(cfg.domain, landing));
router.use(vhost('www.' + cfg.domain, landing));
router.use(vhost(cfg.subdomains, instance));
