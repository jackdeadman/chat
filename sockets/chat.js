var chat = require('../lib/chat.js');
var Message = require('../models/message');
var mongoose = require('mongoose');
var ChatUtil = require('../lib/chat');


module.exports = function (io) {
	
	function init() {
		io.on('connection', function(socket) {
			socket.broadcast.emit('newUser');
			bindClientEvents(socket);
		});
	}
	
	function bindClientEvents(socket) {
		socket.on('newMessage', function(messageString) {
			// if (!ChatUtil.isValidMessage(messageString)) return;
			
			// messageString = ChatUtil.escapeMsg;
			
			// Save message
			var message = new Message({
				posted_by: new mongoose.Types.ObjectId('55c692819860d79db61bf81b'),
				content: messageString
			});
			
			message.save(function(err) {
				if (err) {
					socket.emit('messageFail');
				} else {
					// Message successfully added, send to everyone
					io.emit('newMessage', message);
					// Tell the sender their message saved succesfully
					socket.emit('messageSuccess');	
				}
			});
		});
	}
	
	init();
}
