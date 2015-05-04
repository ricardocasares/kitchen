/**
 * Module dependencies
 */
var debug = require('debug')('app:instance:api:projects');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var async = require('async');
var projectLimit = require.main.require('./modules/instance/lib/middleware/projectLimit');
var ensureAuthorized = require.main.require('./modules/instance/lib/middleware/ensureAuthorized');
var NotFoundError = require.main.require('./errors').NotFoundError;
var MongooseValidationError = require.main.require('./errors').MongooseValidationError;

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
router.post('/',
  ensureAuthorized('isAdmin','isOwner'),
  projectLimit,
  postProject
);
router.get('/:id', getProjectById);

/**
 * Returns a list of projects
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function getProjects (req, res, next) {
  var Project = req.db.model('Project');
  var query = { people: req.user._id };
  
  if(req.user.isAdmin || req.user.isOwner) {
    query = {};
  }

  Project.find(query, function(err, docs) {
    if(err) {
      return next(err);
    }
    res.json({ count: docs.length, data: docs });
  }).populate('people creator');
}

/**
 * Returns a project by id
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function getProjectById (req, res, next) {
  var query = { _id: req.params.id, people: req.user._id };
  
  if(req.user.isAdmin || req.user.isOwner) {
    query = { _id: req.params.id };
  }

  var Project = req.db.model('Project');

  Project.findOne(query, function (err, doc) {
    if(err) {
      return next(err);
    }
    if(!doc) {
      return next(new NotFoundError('Project not found'));
    }
    debug('serving project id %s', doc._id);
    res.json(doc);
  }).populate('creator people');
}

/**
 * Creates a new project
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @param  {Function}   next Callback
 */
function postProject (req, res, next) {
  var people = req.body.people;
  delete req.body.people;
  var Project = req.db.model('Project');
  var project = new Project(req.body);

  project.creator = req.user._id;
  project
    .save()
    .then(createUsers, errorHandler);

  function createUsers(projectDoc) {
    var User = req.db.model('User');
    var tasks = [];
    people.forEach(function(person) {
      tasks.push(function(cb) {
        User.findOrCreate(person, cb);
      });
    });
    async.series(tasks, function(err, results) {
      if(err) {
        errorHandler(err);
      }
      if(results) {
        var users = [];
        results.forEach(function(result) {
          users.push(result[0]);
        });
        usersSaved(users, projectDoc);
      }
    });
  }

  function usersSaved(userDocs, projectDoc) {
    projectDoc.people = userDocs;
    projectDoc
      .save()
      .then(projectResolved, errorHandler);
  }

  function projectResolved(projectDoc) {
    debug('serving project id %s', projectDoc._id);
    res.json(projectDoc);
  }
  
  function errorHandler(err) {
    if(err.name === 'ValidationError') {
      return next(new MongooseValidationError(err)); 
    } else {
      return next(new Error(err));
    }
  }
}


