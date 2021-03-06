/**
 * Module dependencies
 */
var debug = require('debug')('app:cluster');
var cluster = require('cluster');

if (cluster.isMaster) {
  var cpuCount = require('os').cpus().length;
  for (var i = 0; i < cpuCount; i++) {
    debug('forking process');
    cluster.fork();
  }
} else {
  require('./app');
}

cluster.on('exit', function (worker) {
  debug('worker ' + worker.id + ' died');
  debug('replacing worker');
  cluster.fork();
});
