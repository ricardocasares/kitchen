/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Project schema
 * @type {Schema}
 */
var ProjectSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
  creator: {type: Schema.ObjectId, ref: 'User'},
  people: [{type: Schema.ObjectId, ref: 'User'}]
});

ProjectSchema.options.toJSON = {
  transform: function(projectDoc) {
    var doc = projectDoc.toJSON({transform: false});
    delete doc.__v;
    return doc;
  }
};

/**
 * Module exports
 */
module.exports = mongoose.model('Project', ProjectSchema);
