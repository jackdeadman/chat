module.exports = function(io) {
	io.on('connection', function(socket) {
		socket.broadcast.emit('newUser');
		console.log('user connected');
		
		socket.on('newMessage', function(msg) {
			io.emit("newMessage",msg);
		});
	});
	
};