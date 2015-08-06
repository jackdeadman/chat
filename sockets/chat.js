var chat = require('../lib/chat.js');

module.exports = function(io) {
	io.on('connection', function(socket) {
		socket.broadcast.emit('newUser');
		console.log('user connected');
		
		socket.on('newMessage', function(msg) {
			
			if (chat.isValidMessage(msg)) {
				io.emit("newMessage", chat.parseMsg(msg));				
			}

		});
	});
	
};