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
      client.query('SELECT form_record_id, song_title_text, tone_set_note, scale_mode_text, teachable_elements_text FROM song_collection WHERE user_id=$1 LIMIT 30;', [userId], function(err, result) {
      if(err) {
        console.log('error making database query: ', err);
        res.sendStatus(500);
      } else {
        // if(result.rows > 0) {
        //   //
        // }
        res.send(result.rows);
        console.log('result.rows for songs get =', result.rows);
      }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get


module.exports = router;
