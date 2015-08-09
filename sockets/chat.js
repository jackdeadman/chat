var chat = require('../lib/chat.js');
var Message = require('../lib/message');
var Message1 = require('../models/message');
var mongoose = require('mongoose');

module.exports = function(io) {
	
	var typingCallback = function(socket) {
		socket.broadcast.emit('userStoppedTyping');
	};
	
	io.on('connection', function(socket) {
		socket.store = {};
		
		socket.broadcast.emit('newUser');
		console.log('user connected');
		
		socket.on('newMessage', function(msgString) {
			
			var m = new Message1({
				posted_by: new mongoose.Types.ObjectId('55c692819860d79db61bf81b'),
    			content: msgString
			});
			m.save();
			
			io.emit('newMessage', m);
			
			// var msg = new Message(msgString);
			// chat.parseMsg(msg);
			
			// if (chat.isValidMessage(msg)) {
			// 	msg.types = Message.MessageType;
			// 	io.emit("newMessage", msg);
			// }

		});
		
		socket.store.isTyping = false;
		
		socket.on('userTyping', function() {
			socket.broadcast.emit('userStartedTyping');
			
			if (socket.store.isTyping) {
				clearTimeout(socket.store.i);
				socket.store.i = setTimeout(function() {
					typingCallback(socket);
					socket.store.isTyping = false;
				},1000);
			} else {
				socket.store.isTyping = true;
				socket.store.i = setTimeout(function() {
					typingCallback(socket);
					socket.store.isTyping = false;
				},1000);
			}

		});
		
		
	});
	
};