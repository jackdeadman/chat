var express = require('express');
var Message = require('../models/message');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log(req.cookies);
  res.render('index', {title: 'Chat'});
});

router.get('/test', function(req, res, next){
  res.send('Worked');
});

router.get('/api/messages/:count/:start', function(req, res) {
  Message.find({}, function(err, messages) {
    
    if (err) res.send({error: true});
    
    res.send(messages);
  });
});

router.get('/create/:message', function(req, res, next) {
  var messageString = req.params.message; 
  
  var message = new Message({
    posted_by: new mongoose.Types.ObjectId('55c692819860d79db61bf81b'),
    content: messageString
  });
  
  message.save(function (err) {
  
  if (err)
    console.log(err);
  });
  
  Message.find({}, function(err, messages) {
    
    if (err) res.send({error: true});
    
    res.send(messages);
  });
  
 });


module.exports = router;
