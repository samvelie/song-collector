var express = require('express');
var router = express.Router();
var pg = require('pg');

var pool = require('../modules/pg-pool');

router.get('/', function(req, res) {
  console.log('hit /users router.get, have this user info:', req.userInfo);
  res.send(req.userInfo);
});

module.exports = router;
