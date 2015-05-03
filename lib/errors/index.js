/**
 * Module exports
 */
exports.UnauthorizedError = UnauthorizedError;
exports.NotFoundError = NotFoundError;
exports.ForbiddenError = ForbiddenError;
exports.MongooseValidationError = MongooseValidationError;

/**
 * Unauthorized Error constructor
 * @param {String} msg Error message
 */
function UnauthorizedError (msg) {
  Error.call(this);
  Error.captureStackTrace(this, UnauthorizedError);

  this.status = 401;
  this.name = 'UnauthorizedError';
  this.message = msg;
}

UnauthorizedError.prototype = Error.prototype;

/**
 * Not found Error constructor
 * @param {String} msg Error message
 */
function NotFoundError (msg) {
  Error.call(this);
  Error.captureStackTrace(this, NotFoundError);

  this.status = 404;
  this.name = 'NotFoundError';
  this.message = msg;
}

NotFoundError.prototype = Error.prototype;

/**
 * Forbidden Error
 * @param {String} msg Error message
 */
function ForbiddenError (msg) {
  Error.call(this);
  Error.captureStackTrace(this, ForbiddenError);

  this.status = 403;
  this.name = 'ForbiddenError';
  this.message = msg;
}

ForbiddenError.prototype = Error.prototype;

/**
 * Mongoose Validation Error
 * @param {MongooseValidationError} err Mongoose error
 */
function MongooseValidationError (err) {
  Error.call(this);
  Error.captureStackTrace(this, MongooseValidationError);

  this.status = 422;
  this.name = 'ValidationError';
  this.message = err.message;  
  this.errors = [];
  
  for (var key in err.errors) {
    if (err.errors.hasOwnProperty(key)) {      
      this.errors.push({
        resource: err.message.split(' ')[0],
        field: err.errors[key].path,
        type: err.errors[key].kind,
        i18n: 'errors.validation.' + err.errors[key].path + '.' + err.errors[key].kind
      });
    }
  }
}

MongooseValidationError.prototype = Error.prototype;
