/* global App */
/* global DOM */

App.Chat = (function(Api, User) {
	'use strict';	
	
	var VERSION = '0.0.1';
	
	var _settings = {
		// Get id from url
		roomId: location.href.match(/[^/]*$/)[0],
		initialMessageCount: 20,
		loadMoreAmount: 10,
		textMessageTemplate: '<li class="message">{{message}}</li>',
		imageMessageTemplate: '<img class="" src="{{src}}">'
	}
	
	var client;
	var room;
	var currentUser;
	
	// Cache DOM:
	var $container = DOM('.chat-container');
	var $messagesContainer = $container.find('.messages');
	var $messageForm = $container.find('.message-form textarea');

	// Private:
	function _init() {
		currentUser = User.getUser();
		client = new Api(currentUser);
		room = client.getRoom(_settings.roomId);
		
		room.getMessages(0, _settings.initialMessageCount, function(err, messages) {
			room.enter();
			_displayInitialMessages(messages);
			_bindEvents();
		});
		
	}
	
	function _bindEvents() {
		
		// Socket Events		
		room.onNewMessage(function(message) {
			_displayNewMessage(message);
		});
		
		// DOM events
		$messageForm.on('keydown', function(e) {
			room.userIsTyping();
			// Handle enter press
			if (e.keyCode === 13) {
				e.preventDefault();
				sendMessage();
			}
		});
	}
	
	function _createTextMessage(message) {
		return DOM.renderTemplate(_settings.textMessageTemplate, { message: message.content });
	}
	
	function _createImageMessage(src) {
		return DOM.renderTemplate(_settings.imageMessageTemplate, { src: src });
	}
	
	function _displayInitialMessages(messages) {

		for (var i = 0; i < messages.length; ++i) {
			var message = messages[i];
			_displayNewMessage(message);
		}
	}
	
	function _displayNewMessage(message) {
		var messageNode;
		if (message.type === Api.messageType.IMAGE) {
			messageNode = _createImageMessage(message.value);
		} else {
			messageNode = _createTextMessage(message);
		}
		$messagesContainer.append(messageNode);
	}
	
	function _handleMessageAck(err) {
		if(err) {
			alert('Error');
		} else {
			// alert('success');
		}
	}
	
	// Public:
	function sendMessage(message) {
		if (typeof message === 'undefined') {
			room.sendMessage($messageForm.value(), _handleMessageAck);
			$messageForm.value('');	
		} else {
			room.sendMessage(message, _handleMessageAck);	
		}
	}
		
	
	_init();
	return {
		VERSION: VERSION,
		sendMessage: sendMessage
	}
		
})(App.Api, App.User);
