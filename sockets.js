var chatController = require('./controllers/chat');

function bindClient(io,socket) {
	var defaultCallback = function() {};
	
	socket.on('entered', function(req) {
		// Tell everyone else that someone has entered
		socket.join(req.roomId);
		socket.broadcast.to(req.roomId).emit('newUser');
	});
	
	socket.on('requestMessages', function(req, handle) {
		chatController.getMessages(io, socket, req, handle || defaultCallback);
	});
	
	socket.on('requestMessage', function(req, handle) {
		chatController.getMessage(io, socket, req, handle || defaultCallback);
	});
	
	socket.on('newMessage', function(req, handle) {
		chatController.sendMessage(io, socket, req, handle || defaultCallback);
	});
	
	socket.on('updateMessage', function(req, handle) {
		chatController.updateMessage(io, socket, req, handle || defaultCallback);
	});
	
	socket.on('changeTopic', function(req, handle) {
		chatController.changeTopic(io, socket, req, handle || defaultCallback);
	});
}
// Add names rooms/namespaces
module.exports = function(io) {
	io.on('connection', function(socket) {
		bindClient(io, socket);
	});
}; 
