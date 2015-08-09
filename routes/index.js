var express = require('express');
var Message = require('../models/message');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Chat'});
});

router.get('/chat/:id', function(req, res, next) {
  if (req.params.id !== 'xmkmxk') {
    res.status(404);
    res.render('404');
  }
  res.render('chat', {title: 'Chat'});
});

router.get('/api/messages/:count/:start', function(req, res) {
  Message.find({}, function(err, messages) {
    if (err) res.send({error: true});
    res.send(messages);
  });
});

module.exports = router;
