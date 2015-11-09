var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
    	required: true,
    	trim: true
	},
	encrypted_password: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true
	},
	mobile: {
		type: Number,
		unique: true
	}
});

UserSchema.plugin(timestamps);
module.exports = mongoose.model('User', UserSchema);