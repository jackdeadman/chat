var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

var katex = require('parse-katex');

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

MessageSchema.methods.sanatise = function() {
	this.content = entities.encode(this.content);
};

MessageSchema.methods.convertNewLines = function() {
	this.content = this.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

MessageSchema.methods.getUsers = function() {
	var users = this.content.match(/@\w*/g) || [];
	return users.map(function(value){
		// Remove the '@'
		return {name: value.substring(1)};
	});
}

MessageSchema.methods.renderLatex = function() {
	this.content = katex.renderLaTeX(this.content);
}

MessageSchema.statics.isValidMessage = function(message) {
	return message.replace(/\s/g, "").length > 0;
}



MessageSchema.plugin(timestamps);
module.exports = mongoose.model('Message', MessageSchema);