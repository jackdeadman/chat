var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	posted_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	content: {
		type: String,
		required: true
	},
	room_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Room"
	}
});


MessageSchema.plugin(timestamps);
module.exports = mongoose.model('Message', MessageSchema);