var chat = require('../../lib/chat.js');

describe('Chat module spec', function(){
	
	it('Should be able to escape tags', function() {
		expect(chat.escapeMsg('<b>hi</b>')).toEqual('&lt;b&gt;hi&lt;/b&gt;');
		expect(chat.escapeMsg('<script>hi</script>')).toEqual('&lt;script&gt;hi&lt;/script&gt;');
	});
		
	it('Should be able to detect a message is directed at a user', function() {
		expect(chat.getUsers('hi @jack')).toEqual([{name: 'jack'}]);
		expect(chat.getUsers('hi @jack and @jill')).toEqual([{name: 'jack'},{name: 'jill'}]);
		expect(chat.getUsers('no user here :)')).toEqual([]);
	});
	
	it('Should be able to varify valid messages', function() {
		expect(chat.isValidMessage('')).toBe(false);
		expect(chat.isValidMessage('  ')).toBe(false);
		expect(chat.isValidMessage('	  ')).toBe(false);
		expect(chat.isValidMessage('	')).toBe(false);
		expect(chat.isValidMessage('message')).toBe(true);
	});
	
	it('Should be able to convert line breaks into html line breaks', function() {
		expect(chat.parseMsg('hi\njack')).toBe('hi<br>jack');
	});
});
