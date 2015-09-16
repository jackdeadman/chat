var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var Hashids = require('hashids');
var hashids = new Hashids('_W-Aubp8=v28Xyv~FX2fLGg_UgpOM0-Ele zbMKx0F hdFK-Ci0iaglN8OmF');

var RoomSchema = new Schema({
	
	topic: {
		type: String,
		required: true,
		default: 'Enter a topic here...'	
	}
	
});

RoomSchema.statics.findByPublicId = function(id, handle) {
	var actualId = hashids.decodeHex(id);
	this.findOne({_id: actualId}, handle);
};

RoomSchema.methods.getMessages = function(handle, amount) {
	this.model('Message')
		.find({room_id: this._id})
		.sort({$natural: -1})
		.limit(amount)
		.exec(function(err, messages) {
			handle(err, messages.reverse());
		});
}

RoomSchema.plugin(timestamps);
module.exports = mongoose.model('Room', RoomSchema);