var Message = require('../../models/message');
var chatController = require('../../controllers/chat');

describe('Message spec', function(){
	
	
	it('should be able to clean messages', function() {
		var message = new Message();
		message.content = 'Hi\n jack <br>';
		var messages = chatController.cleanMessages([message]);
		
		expect(messages[0].content).toEqual('Hi<br> jack &lt;br&gt;');
	});
	
	
	it('Should be able to escape tags', function() {
		
		// Only content matters for these tests
		var message = new Message();
		
		message.content = '<b>hi</b>';
		message.sanatise();
		expect(message.content).toEqual('&lt;b&gt;hi&lt;/b&gt;');
		
		message.content = '<script>hi</script>';
		message.sanatise();
		expect(message.content).toEqual('&lt;script&gt;hi&lt;/script&gt;');
	});
	
	it('Should be able to replace line breaks with html line breaks', function() {
		var message = new Message();
		
		message.content = 'hi\n jack';
		message.convertNewLines();
		expect(message.content).toEqual('hi<br> jack');
	});
		
	// it('Should be able to detect a message is directed at a user', function() {
	// 	expect(room.getUsers('hi @jack')).toEqual([{name: 'jack'}]);
	// 	expect(room.getUsers('hi @jack and @jill')).toEqual([{name: 'jack'},{name: 'jill'}]);
	// 	expect(room.getUsers('no user here :)')).toEqual([]);
	// });
	
	it('Should be able to varify valid messages', function() {
		expect(Message.isValidMessage('')).toBe(false);
		expect(Message.isValidMessage('	  ')).toBe(false);
		expect(Message.isValidMessage('	')).toBe(false);
		expect(Message.isValidMessage('message')).toBe(true);
	});
	
	// it('Should be able to convert line breaks into html line breaks', function() {
	// 	expect(Message.parseMsg('hi\njack')).toBe('hi<br>jack');
	// });
});
