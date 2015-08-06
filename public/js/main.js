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

var socket = io();
socket.on('newUser', function() {
	addMessage('New user connected');
});

function init() {
	var input = document.querySelector('.chat-container .message-form');
	input.addEventListener('keyup', function(e) {
		
		socket.emit('userTyping');
		
		if (e.keyCode == 13) {
			var message = e.target.value;
			e.target.value = '';
			socket.emit('newMessage', message);
		}
	});
}



socket.on('newMessage', function(msg) {
	addMessage(msg);
});

var typing = false;

socket.on('userStartedTyping', function(){
	var el = document.getElementById('user-typing');
	el.innerHTML = 'User is typing';
});

socket.on('userStoppedTyping', function(){
	console.log('stopped typing');
	var el = document.getElementById('user-typing');
	el.innerHTML = '';
});