module.exports = errorHandler;

function errorHandler (err, req, res, next) {
  var error = {};
  error.status = err.statusCode;
  error.error = err.name;
  error.message = err.message;
  if(process.ENV !== 'production') {
    error.stack = err.stack;
  }
  res
    .status(err.statusCode)
    .json(error);
}
