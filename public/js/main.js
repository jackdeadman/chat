/* global io */
document.addEventListener('DOMContentLoaded', init);


function addMessage(str) {
	var messages = document.querySelector('.messages');
	var message = document.createElement('li');
	message.innerHTML = str;
	message.className = "message msg-sender";
	messages.appendChild(message);
	messages.scrollTop = messages.scrollHeight;
}

function init() {
	var input = document.querySelector('.chat-container .message-form');
	input.addEventListener('keyup', function(e) {
		if (e.keyCode == 13) {
			var message = e.target.value;
			e.target.value = '';
			socket.emit('newMessage', message);
		}
	});
}

var socket = io();
socket.on('newUser', function() {
	addMessage('New user connected');
});

socket.on('newMessage', function(msg) {
	addMessage(msg);
});