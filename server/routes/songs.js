var express = require('express');
var router = express.Router();
var pg = require('pg');

var pool = require('../modules/pg-pool');

router.get('/', function(req, res) {
  var userId = req.userInfo[0].id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM song_collection WHERE user_id=$1 LIMIT 30;', [userId], function(err, result) {
      if(err) {
        console.log('error making database query: ', err);
        res.sendStatus(500);
      } else {
        // if(result.rows > 0) {
        //   //
        // }
        res.send(result.rows);

      }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get


module.exports = router;
