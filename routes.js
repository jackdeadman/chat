var express = require('express');
var router = express.Router();

var siteController = require('./controllers/site');
var chatController = require('./controllers/chat');

router.get('/', siteController.loadHomePage);

router.get('/chat', function(req, res, next) {
	res.redirect('/');
});

router.get('/chat/new', chatController.createNewChat);
router.get('/chat/:id', chatController.loadChat);


module.exports = router;