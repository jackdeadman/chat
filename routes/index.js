var express = require('express');
var mongoose = require('mongoose');
var Hashids = require('hashids');

var Message = require('../models/message');
var Room = require('../models/room');

var router = express.Router();
var hashids = new Hashids('_W-Aubp8=v28Xyv~FX2fLGg_UgpOM0-Ele zbMKx0F hdFK-Ci0iaglN8OmF');
var ObjectId = mongoose.Types.ObjectId;

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Chat'});
});

router.get('/chat/new', function(req, res, next) {
  
  Room.count({},function(err, number) {
    var room = new Room({
      public_id: hashids.encode(number)
    });
    room.save(function(err) {
      if (err) {
        console.log(err);
        res.send('Failed to create chat');
      } else {
        res.redirect('/chat/'+hashids.encodeHex(room._id));
      }
    });
  });
});

router.get('/chat/:id', function(req, res, next) {
  
  var id = hashids.decodeHex(req.params.id);
  
  Room.count({_id: id}, function(err, count) {
    if (count === 1) {
      res.render('chat', {title: 'Chat'});    
    } else {
      res.status(404);
      res.send('No chat found');
    }
  });
  
});


// REST API
router.get('/api/chat/:room_id/messages/:count/:start', function(req, res) {
  var id = new ObjectId(hashids.decodeHex(req.params.room_id));

  Message.find({room_id: id}, function(err, messages) {
    if (err) res.send({error: true});

    res.send(messages);
  });
});

module.exports = router;
