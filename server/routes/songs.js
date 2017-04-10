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
      }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

// post uploaded file to database
router.post('/addImage', function(req, res) {
  var userId = req.userInfo[0].id; // will become user id pulled from decoder token
  var imageObject = req.body;
  console.log('imageObject: ', imageObject);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('WITH new_image_id AS (INSERT INTO images (image_file_name, image_type, image_size, image_url, image_handle) VALUES ($1, $2, $3, $4, $5) RETURNING id) INSERT INTO images_users (image_id, user_id) VALUES ((SELECT id FROM new_image_id), $6);', [imageObject[0].filename, imageObject[0].mimetype, imageObject[0].size, imageObject[0].url, imageObject[0].handle, userId], function(err, result) {
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get


// Object
// filename
// :
// "Screen Shot 2017-04-09 at 1.15.52 PM.png"
// handle
// :
// "eC6vNC9T7K5ppoakx4EZ"
// mimetype
// :
// "image/png"
// size
// :
// 51058
// source
// :
// "local_file_system"
// status
// :
// "Stored"
// url
// :
// "https://cdn.filestackcontent.com/eC6vNC9T7K5ppoakx4EZ"

module.exports = router;
