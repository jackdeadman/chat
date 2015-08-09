var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

/**
 * user
 * message
 * created_at
 * updated_at
 */

var MessageSchema = new Schema({
	posted_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	content: {
		type: String,
		required: true
	}
});



MessageSchema.plugin(timestamps);
module.exports = mongoose.model('Message', MessageSchema);