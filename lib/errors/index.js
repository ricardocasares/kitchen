exports.NotFoundError = NotFoundError;
exports.ForbiddenError = ForbiddenError;
exports.MongooseValidationError = MongooseValidationError;

function NotFoundError (msg) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.status = '404';
  this.name = 'NotFoundError';
  this.message = msg;
}

NotFoundError.prototype = Error.prototype;

function ForbiddenError (msg) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.status = '403';
  this.name = 'ForbiddenError';
  this.message = msg;
}

ForbiddenError.prototype = Error.prototype;

function MongooseValidationError (err) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.status = '422';
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
