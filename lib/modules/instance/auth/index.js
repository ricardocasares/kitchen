/**
 * Module dependencies
 */
var debug = require('debug')('app:instance:auth');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var local = require('./strategies/local');
var bodyParser = require('body-parser');
var ensureAuthenticated = require('../middleware/ensureAuthenticated');
var loginHandler = require('../middleware/loginHandler');
var logoutHandler = require('../middleware/logoutHandler');

/**
 * Module exports
 */
module.exports = router;

/**
 * Passport setup
 */
passport.use(local);
router.use(passport.initialize());
router.use(passport.session());

/**
 * Passport serializer
 * @param  {Object}   user   User object
 * @param  {Function} done   Callback
 */
passport.serializeUser(function(user, done) {
  debug('serializing', user.email);
  done(null, user._id);
});

/**
 * Passport deserializer
 * @param  {Request}  req    Express request object
 * @param  {String}   user   User id
 * @param  {Function} done   Callback
 */
passport.deserializeUser(function(req, user, done) {
  debug('deserializing user id', user);
  var User = req.db.model('User');
  User.findById(user, function(err, doc){
    debug('deserialized', doc.email);
    done(err, doc);
  });
});

/**
 * Addtional middleware
 */
router.use(bodyParser.json());

/**
 * Routes setup
 */
router.post('/session', loginHandler);
router.use(ensureAuthenticated);
router.delete('/session', logoutHandler);
router.get('/session', function(req, res) {
  res.json(req.user);
});
