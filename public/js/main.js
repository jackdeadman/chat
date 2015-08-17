/* global moment */
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
		textMessageTemplate: DOM('#message-template').html(),
		editMessageTemplate: DOM('#edit-message-template').html(),
		imageMessageTemplate: '<img class="" src="{{src}}">'
	}
	
	var client;
	var room;
	var currentUser;
	
	// Cache DOM:
	var $container = DOM('.chat-container');
	var $messagesContainer = $container.find('.messages');
	var $messageForm = $container.find('.message-form textarea');
	var $messageButton = $container.find('.send-message-btn');

	// Private:
	function _init() {
		$messagesContainer.html('');
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
		
		$messageButton.on('click', function() {
			sendMessage();
		});
		
		$messagesContainer.on('click', function(e) {
			
			var node = _lookUpTree(e.target, function(element){
				if (element.classList)
					return element.classList.contains('edit');
			});
			
			if (node) {
				e.preventDefault();
				_editMessage(node.parentNode);
			}
		});
	}
	
	function _editMessage(node) {
		var messageId = node.dataset.messageId;
		room.getMessage(messageId, function(message) {
			var modal = DOM.renderTemplate(_settings.editMessageTemplate, {
				message: message.content
			});
			
			var modal = convertToNodes(modal);
			
			DOM(modal).find('.save').on('click', function() {
				var message = DOM(modal).find('textarea').value();
				room.updateMessage(messageId, message, function(err, message){
					if (err) {
						console.log(err);
						return;
					}
					// Remove modal
					modal.parentNode.removeChild(modal);
					// TODO: re-render whole message
					DOM(node).find('.message-content').html(message.content);	
				});	
			});
			
			// Add modal
			document.body.appendChild(modal);
		});
	}
	
	function convertToNodes(string) {
		var div = document.createElement('div');
		div.innerHTML = string;
		return div.children[0];
	}
	
	// recursively look up tree for an element that satisfies
	// the function
	function _lookUpTree(child, matcher) {
		if (child.parentNode === null)
			return false;
		if (matcher(child))
			return child;
		else
			return _lookUpTree(child.parentNode, matcher);
	}
	
	function _createTextMessage(message) {
		return DOM.renderTemplate(_settings.textMessageTemplate,{
				message: message.content,
				profileUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/chadengle/128.jpg',
				postedAt: moment(message.createdAt).fromNow()
		});
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
		var children = $messagesContainer.elements[0].children;
		var node = children[children.length-1];
		node.dataset.messageId = message._id;
		
		var container = $messagesContainer.elements[0];
		container.scrollTop = container.scrollHeight;
		
		return node;
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
