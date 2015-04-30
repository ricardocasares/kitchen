/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var projectLimit = require('../../middleware/projectLimit');
var debug = require('debug')('app:modules:instance:api:projects');
var NotFoundError = require.main.require('../lib/errors').NotFoundError;
var MongooseValidationError = require.main.require('../lib/errors').MongooseValidationError;

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
router.post('/', projectLimit, postProject);
router.get('/:id', getProjectById);

/**
 * Returns a list of projects
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function getProjects (req, res, next) {
  var Project = req.db.Project;
  Project.find({}, function(err, docs) {
    if(err) {
      return next(err);
    }
    res.json({ count: docs.length, data: docs });
  }).select('-people');
}

/**
 * Returns a project by id
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function getProjectById (req, res, next) {
  var Project = req.db.Project;
  Project.findOne({_id: req.params.id }, function (err, doc) {
    if(err) {
      return next(err);
    }
    if(!doc) {
      return next(new NotFoundError('Project not found'));
    }
    res.json(doc);
  }).populate('people');
}

/**
 * Creates a new project
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function postProject (req, res, next) {
  var users = req.body.people;
  delete req.body.people;
  var project = new req.db.Project(req.body);
  
  project
    .save()
    .then(createUsers, errorHandler);

  function createUsers(prjct) {
    req.db.User
      .create(users)
      .then(function(docs) {
        usersSaved(docs, prjct);
      }, errorHandler);
  }

  function usersSaved(docs, prjct) {
    project.people = docs;
    project
      .save()
      .then(projectResolved, errorHandler);
  }

  function projectResolved(project) {
    res.json(project);
  }
  
  function errorHandler(err) {
    if(err.name === 'ValidationError') {
      return next(new MongooseValidationError(err)); 
    } else {
      return next(new Error(err));
    }
  }
}


