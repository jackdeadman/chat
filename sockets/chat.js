var chat = require('../lib/chat.js');
var Message = require('../models/message');
var mongoose = require('mongoose');
var ChatUtil = require('../lib/chat');

// TEMP
var Hashids = require('hashids');
var hashids = new Hashids('_W-Aubp8=v28Xyv~FX2fLGg_UgpOM0-Ele zbMKx0F hdFK-Ci0iaglN8OmF');

module.exports = function (io) {
	
	function init() {
		io.on('connection', function(socket) {
			socket.broadcast.emit('newUser');
			bindClientEvents(socket);
		});
	}
	
	function bindClientEvents(socket) {
		socket.on('newMessage', function(messageFromClient) {
			// if (!ChatUtil.isValidMessage(messageString)) return;
			var id = hashids.decodeHex(messageFromClient.roomId);
			// messageString = ChatUtil.escapeMsg;
			
			// Save message
			var message = new Message({
				room_id: new mongoose.Types.ObjectId(id),
				posted_by: new mongoose.Types.ObjectId('55c692819860d79db61bf81b'),
				content: messageFromClient.messageString
			});
			
			message.save(function(err) {
				if (err) {
					console.log(err);
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
