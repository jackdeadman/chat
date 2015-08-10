/* global io */
/* global App */

var App = {};

App.Api = (function() {
	'use strict';
	
	Api.VERSION = '0.0.1';
	var _socket;
	
	function Api(user) {
		this.user = user;
		_connect();
	}
	
	Api.messageType = {
		IMAGE: 'image',
		TEXT: 'text',
		CODE: 'code'
	}
	
	Api.prototype.getRoom = function (roomId) {
		return new Room(roomId, this);
	};
	
	Api.prototype.hasPermission = function (room) {
		return true;
	};
	
	function Room(roomId, client) {
		this.roomId = roomId;
		this.client = client;
		this.typingUsers = [];
	}
	
	// Events
	Room.prototype.onNewMessage = function(handle) {
		_socket.on('newMessage', function(message) {
			handle.call(this, message);
		});
	};

	// Local user has stopped typing
	Room.prototype.userHasStoppedTyping = function() {
		_socket.emit('userStoppedTyping', this.client.user);
	}
	
	// Triggers
	
	Room.prototype.enter = function(handle) {
		_socket.emit('entered', {roomId: this.roomId});
	};
	
	Room.prototype.getMessages = function(start, amount, handle) {
		_socket.emit('requestMessages', {
			roomId: this.roomId,
			start: start,
			amount: amount,
			handle: handle,
			user: {}
		}, handle);
	};
	
	Room.prototype.userIsTyping = function() {
		_socket.emit('userIsTyping', this.client.hash);	
	};
	
	Room.prototype.sendMessage = function(messageString, callback) {
		var message = {
			messageString: messageString,
			roomId: this.roomId
		}
		_socket.emit('newMessage', message, function(err) {
			callback(err);
		});
	}
	
	function _connect() {
		// Open socket
		try {
			_socket = io();
		} catch (err) {
			_failedToConnect();
		}
	}
	
	function _failedToConnect() {
		throw new Error("Failed to connect to API. :'(");
	}
	
	return Api;
})();