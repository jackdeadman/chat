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
		pageTitle: document.title,
		textMessageTemplate: DOM('#message-template').html(),
		editMessageTemplate: DOM('#edit-message-template').html(),
		notificationDisplayLength: 2000,
		updateTimer: 1000 // How often the times messages sent are updated (ms)
	}
	
	var client;
	var room;
	var currentUser;
	var _messages = [];
	var _windowVisible = true;
	var unreadMessages = 0;
	
	// Cache DOM:
	var $container = DOM('.chat-container');
	var $messagesContainer = $container.find('.messages');
	var $messageForm = $container.find('.message-form .message-entry');
	var $messageButton = $container.find('.send-message-btn');
	var $collapseButton = $container.find('.collapse-message-entry');

	// Private:
	function _init() {
		$messagesContainer.html('');
		Notification.requestPermission();
		
		currentUser = User.getUser();
		client = new Api(currentUser);
		room = client.getRoom(_settings.roomId);
		
		room.getMessages(0, _settings.initialMessageCount, function(err, messages) {
			room.enter();
			_displayInitialMessages(messages);
			_messages = messages;
			_bindEvents();
			
			setInterval(function() {
				_updateMessageTimes();
			}, _settings.updateTimer);
			
		});
		
	}
	
	function _bindEvents() {
		
		// Socket Events		
		room.onNewMessage(function(message) {
			_messages.push(message);
			_notifyNewMessage(message);
			_displayNewMessage(message);
		});
		
		room.onConnectionLost(function() {
			window.location = '/';
		});
		
		room.onMessageEdited(function(message) {
			var $node = DOM('[data-message-id="' + message._id + '"]');
			$node.find('.message-content').html(message.content);
		});
		
		// DOM events
		
		window.onfocus = function() {
			_windowVisible = true;
			unreadMessages = 0;
			document.title = _settings.pageTitle;
		};
		
		window.onblur = function() {
			_windowVisible = false;
		};
		
		$messageForm.on('keydown', function(e) {
			room.userIsTyping();
			// Handle enter press
			if (e.keyCode === 13 && !e.shiftKey) {
				e.preventDefault();
				$messageButton.elements[0].click();
			}
		});
		
		$messageForm.on('input', function() {
			var node = $messageButton.elements[0];

			if (this.value === '') 
				node.classList.add('disabled');
			else
				node.classList.remove('disabled');
		});
		
		$messageButton.on('click', function() {
			if ($messageForm.value() !== '')
				sendMessage();
		});
		
		$messagesContainer.on('click', function(e) {
			
			var node = _lookUpTree(e.target, function(element){
				if (element.classList)
					return element.classList.contains('edit-message-btn');
			});
			
			if (node) {
				e.preventDefault();
				_editMessage(node.parentNode.parentNode.parentNode);
			}
		});
		
		$collapseButton.on('click', function() {
			var messageForm = $container.find('div.message-form');
			var messageArea = $container.find('.messages');
			
			console.log("testing");
			$collapseButton.elements[0].textContent = 'Expand';
			
			if( messageForm.elements[0].style.display === 'none') {
				messageForm.elements[0].style.display = 'flex';
				messageArea.elements[0].style.height = '400px';
				$collapseButton.elements[0].textContent = 'Collapse';
			}else{
				messageForm.elements[0].style.display = 'none';
				messageArea.elements[0].style.height = '600px';
				
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
				var message = DOM(modal).find('.message-entry').value();
				room.updateMessage(messageId, message, function(err, message){
					if (err) {
						console.log(err);
						return;
					}
					// Remove modal
					modal.parentNode.removeChild(modal);	
				});	
			});
			
			DOM(modal).find('.message-entry').on('keydown', function(e) {
				if (e.keyCode === 13 && !e.shiftKey) {
					e.preventDefault();
					DOM(modal).find('.save').elements[0].click();
				}
			});
			
			// Add modal
			document.body.appendChild(modal);
		});
	}
	
	function _urlify(text) {
		var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(\?([-a-zA-Z0-9@:%_\+.~#?&//=]+)|)/ig;
		return text.replace(urlRegex, function(url) {
			url = url.replace(/.*?:\/\//g, ''); // Strip protocol
			return '<a href="//' + url + '" target="_blank">' + url + '</a>';
		})
	}
	
	function _updateMessageTimes() {
		var $messages = DOM('[data-message-id]');
		
		$messages.each(function(el, i) {
			var message = _messages[i];
			DOM(el).find('time').html(moment(message.createdAt).fromNow());
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
				message: _urlify(message.content),
				profileUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/chadengle/128.jpg',
				postedAt: moment(message.createdAt).fromNow()
		});
	}
	
	function _createImageMessage(src) {
		return DOM.renderTemplate(_settings.imageMessageTemplate, { src: src });
	}
	
	function _notifyNewMessage(message) {
		var title = "A message from Jack";
		var options = {
			body: message.content,
			icon: 'https://s3.amazonaws.com/uifaces/faces/twitter/chadengle/128.jpg'
		};
		if (!_windowVisible) {
			document.title = '('+ ++unreadMessages + ') '+ _settings.pageTitle;
			
			if (Notification.permission === 'granted') {
				var n = new Notification(title, options);
				
				n.onshow = function() {
					setTimeout(function () {
						n.close();
					}, _settings.notificationDisplayLength);
				};
			}
		} 
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
