var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Chat'});
});

router.get('/api/messages/:count/:start', function(req, res) {
  res.send([
    {value: "smkmskm"},
    {value: "smkmskm"},
    {value: "smkmskm"}
    ]);
});


module.exports = router;
