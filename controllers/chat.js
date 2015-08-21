var Room = require('../models/room');
var Message = require('../models/message');
var Hashids = require('hashids');
var mongoose = require('mongoose');

var hashids = new Hashids('_W-Aubp8=v28Xyv~FX2fLGg_UgpOM0-Ele zbMKx0F hdFK-Ci0iaglN8OmF');
var ObjectId = mongoose.Types.ObjectId;

// HTTP

module.exports.loadChat = function(req, res, next) {
	var id = hashids.decodeHex(req.params.id);
	
	Room.count({_id: id}, function(err, count) {
		if (count === 1) {
			res.render('chat', {title: 'Chat'});    
		} else {
			res.status(404);
			res.send('No chat found');
		}
	});
}

module.exports.createNewChat = function(req, res, next) {
	Room.count({},function(err, number) {
		var room = new Room({
			public_id: hashids.encode(number)
		});
		room.save(function(err) {
			if (err) {
				console.log(err);
				res.send('Failed to create chat');
			} else {
				res.redirect('/chat/'+hashids.encodeHex(room._id));
			}
		});
	});
}

// Sockets

function cleanMessages(messages) {
	
	for (var i=0; i<messages.length; i++) {
		var message = messages[i];
		message.sanatise();
		message.renderLatex();
		message.convertNewLines();	
	}
	
	return messages;
}


module.exports.getMessages = function(io, socket, req, handle) {
	Room.findByPublicId(req.roomId, function(err, room) {
		if (typeof room === 'undefined') { 
			handle(null,[]);
			return; 
		}
		room.getMessages(function(err, messages) {
			if (err) handle(new Error('Failed to get messages'));
			else handle(null, cleanMessages(messages));
		}, req.amount);
	});
}

module.exports.getMessage = function(io, socket, req, handle) {
	Message.findOne({_id: req.messageId}, function(err, message) {
		if (err) handle(new Error('Failed to get message'));
		else handle(message);
	});
};

module.exports.updateMessage = function(io, socket, req, handle) {
	if (!Message.isValidMessage(req.messageString)) {
		handle(new Error('Message is invalid'));
		return;
	}
	
	Message.findByIdAndUpdate(req.messageId, {
		content: req.messageString
	}, function(err, message) {
		if (err) handle(new Error('Failed to update message'));
		else {
			message.content = req.messageString;
			handle(null, cleanMessages([message])[0]);
		}
	});
};

function saveMessage(req, handle) {
	var roomId = hashids.decodeHex(req.roomId);
	
	var message = new Message({
		room_id: roomId,
		posted_by: new ObjectId('55c692819860d79db61bf81b'),
		content: req.messageString
	});
	message.save(function(err, message) {
		if (err) handle(new Error('Failed to save message'));
		else handle(null, message);
	});
}

module.exports.sendMessage = function(io, socket, req, handle) {
	if (!Message.isValidMessage(req.messageString)) {
		handle(new Error('Not a valid message'));
		return;
	}
	saveMessage(req, function(err, message) {
		if (err) handle(new Error("Failed to save message"));
		
		handle(null);
		io.to(req.roomId).emit('newMessage', cleanMessages([message])[0]);
	});
}
