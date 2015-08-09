function findValue(str, command) {
	var start = str.indexOf(command)+command.length+1;
	var end = str.indexOf(' ', start);
	return end > -1
		? str.substring(start,end)
		: str.substring(start);
}

function findCommand(str) {
	var commandIndex = str.indexOf('/');
	
	if (commandIndex > -1) {
		var endIndex = str.indexOf(" ",commandIndex);
		var commandGiven = str.substring(commandIndex,endIndex);
		return commandGiven;
	}
	
	return ''; 
}

function inferMsgType(message) {
	var commandGiven = findCommand(message);
	return Message.commands[commandGiven];
};

function Message(str, msgType) {
	this.originalMsg = this.text = str;
	
	if (typeof msgType === 'undefined') {
		msgType = inferMsgType(str);
	}
	
	this.type = msgType;
	this.command = findCommand(str);
	this.setValue(str, msgType); 
}

Message.MessageType = {
	IMAGE: "image",
	TEXT: "text"
};

Message.commands = {
	'/img': Message.MessageType.IMAGE,
	'': Message.MessageType.TEXT
}

Message.prototype.setValue = function() {
	if (this.type === Message.MessageType.TEXT) {
		this.value = this.originalMsg;
	} else {
		this.value = findValue(this.originalMsg, this.command);	
	}
};

Message.save = function(string) {
	
};

module.exports = Message;
