var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

var chat = {
	
	escapeMsg: function(str) {
		return entities.encode(str);
	},
	
	parseMsg: function(str) {
		str = this.escapeMsg(str);
		return str.replace('\n','<br>');
	},
	
	getUsers: function(message) {
		var users = message.match(/@\w*/g) || [];
		return users.map(function(value){
			// Remove the '@'
			return {name: value.substring(1)};
		});
	},
	
	isValidMessage: function(message) {
		return message.replace(/\s/g, "").length > 0;
	} 
};

module.exports = chat;
