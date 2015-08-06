document.addEventListener('DOMContentLoaded', init);


function addMessage(str) {
	var messages = document.querySelector('.messages');
	var message = document.createElement('li');
	message.innerHTML = str;
	message.className = "message msg-sender";
	messages.appendChild(message);
}

function init() {
	var input = document.querySelector('.chat-container .message-form');
	input.addEventListener('keyup', function(e) {
		if (e.keyCode == 13) {
			var message = e.target.value;
			e.target.value = '';
			addMessage(message);
		}
	});
}