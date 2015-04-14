/**
 * Module dependencies
 */

var express = require('express');
var debug = require('debug')('app:modules:instance:api:projects');
var NotFoundError = require.main.require('../lib/errors').NotFoundError;
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

/**
 * Returns a project by id
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */

function getProjectById (req, res, next) {
  req.m.Project.findOne({_id: req.params.projectId }, function (err, doc) {
    if(err) {
      return next(err);
    }
    if(!doc) {
      return next(new NotFoundError('Project not found'));
    }
    res.json(doc);
  });
}

/**
 * Creates a new project
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */

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
