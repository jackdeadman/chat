var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
	
	topic: {
		type: String,
		required: true,
		default: 'No Topic'	
	}
	
});

RoomSchema.plugin(timestamps);
module.exports = mongoose.model('Room', RoomSchema);