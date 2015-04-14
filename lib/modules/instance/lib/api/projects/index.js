/**
 * Module dependencies
 */

var express = require('express');
var MongooseValidationError = require.main.require('../lib/errors').MongooseValidationError;
var projectLimits = require('../../middleware/projectLimits');
var bodyParser = require('body-parser');
var router = express.Router();

/**
 * Module exports
 */

module.exports = router;

/**
 * Middleware mounting
 */

router.use(bodyParser.json());

/**
 * Routes
 */

router.get('/', getProjects);
router.get('/:projectId', getProjectById);
router.post('/', projectLimits, postProject);

/**
 * Returns a list of projects
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function getProjects (req, res, next) {
  req.m.Project.find({}, function(err, docs) {
    res.json({ count: docs.length, data: docs });
  });
}

function getProjectById (req, res, next) {
  res.json({ id: req.params.projectId, name: 'The Kitchen'});
}

function postProject (req, res, next) {
  req.m.Project(req.body)
    .save(function(err, doc) {
      if(err) {
        if(err.name === 'ValidationError') {
          return next(new MongooseValidationError(err)); 
        } else {
          return next(new Error(err));
        }
      }
      res.json(doc);
    });
}
