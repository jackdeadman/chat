var Message = require('./message');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

var chat = {
	
	escapeMsg: function(str) {
		return entities.encode(str);
	},

	parseMsg: function(msg) {
		var str = msg.originalMsg;

		// if (msg.type === Message.MessageType.TEXT) {
			str = this.escapeMsg(str);
			msg.text = str.replace('\n','<br>');
		// }

	},
	
	getUsers: function(msg) {
		var users = msg.originalMsg.match(/@\w*/g) || [];
		return users.map(function(value){
			// Remove the '@'
			return {name: value.substring(1)};
		});
	},

	isValidMessage: function(message) {
		return message.originalMsg.replace(/\s/g, "").length > 0;
	} 
};

module.exports = chat;
