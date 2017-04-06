var express = require('express');
var router = express.Router();
var pg = require('pg');

var pool = require('../modules/pg-pool');

router.get('/', function(req, res) {
  var userId = 1; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM song_collection WHERE user_id=$1;', [userId], function(err, result) {
      if(err) {
        console.log('error making database query: ', err);
        res.sendStatus(500);
      } else {
        if(result.rows > 0) {
          //
        }
        res.send(result.rows);
        console.log('result.rows for songs get =', result.rows);
      }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get


module.exports = router;
