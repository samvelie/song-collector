var express = require('express');
var router = express.Router();
var pg = require('pg');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var emailMessage = require('./email-message');
var gmailpass = require('./gmailpass');

var pool = require('../modules/pg-pool');


// start nodemailer-smtp-transport
var transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: {
    user: 'isongcollect@gmail.com',
    pass: gmailpass().password
  }
}));

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});
// end nodemailer-smtp-transport

router.get('/', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT songs.id, songs.song_title, songs.tone_set, scale_mode_options.scale_mode FROM songs LEFT JOIN meter_options ON songs.meter_id = meter_options.id LEFT JOIN scale_mode_options ON songs.scale_mode_id = scale_mode_options.id WHERE user_id = $1 ORDER BY songs.song_title ASC;', [userId], function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          var allSongs = result.rows;
          client.query('SELECT teachable_elements_options.teachable_elements,teachable_elements_options.id  AS teid, songs.id FROM teachable_elements_options LEFT JOIN song_collection_teachable_elements ON song_collection_teachable_elements.teachable_elements_id = teachable_elements_options.id LEFT JOIN songs ON songs.id = song_collection_teachable_elements.song_id WHERE songs.user_id = $1;', [userId], function(err, result) {
            // console.log('all these things', result.rows);

            for(var j = 0; j < allSongs.length; j++) {
              allSongs[j].teachableElements = [];

              for (var i = 0; i < result.rows.length; i++) {
                // console.log((result.rows[i].id));
                  if(result.rows[i].id == allSongs[j].id) {
                    allSongs[j].teachableElements.push({teachable_elements: (result.rows[i].teachable_elements), id: (result.rows[i].teid)});
                  }
                }
            }
            // console.log('new array', allSongs);

          if (err) {
            console.log('error making database query: ', err);
            res.sendStatus(500);
          } else {
            res.send(allSongs);
          }
        }); // end client.query
      }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

// post uploaded file to database
router.post('/addImage/:id', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  var imageObject = req.body.filesUploaded;
  var isNotation = req.body.isNotation;
  var songId = req.params.id;
  console.log('req.body: ', req.body);
  console.log('imageObject: ', imageObject);
  console.log('isNotation: ', isNotation);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('WITH new_image_id AS (INSERT INTO images (image_file_name, image_type, image_size, image_url, image_handle, is_notation) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id) INSERT INTO images_users (image_id, user_id) VALUES ((SELECT id FROM new_image_id), $7);', [imageObject[0].filename, imageObject[0].mimetype, imageObject[0].size, imageObject[0].url, imageObject[0].handle, isNotation, userId], function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          client.query('SELECT id FROM images WHERE image_url = $1;', [imageObject[0].url], function(err, result) {
            if(err) {
              console.log('error making database query: ', err);
              res.sendStatus(500);
            } else {
              var imageId = result.rows[0].id;
              console.log('image id from select', imageId);
              client.query('INSERT INTO images_songs (image_id, song_id) VALUES ($1, $2);', [imageId, songId], function(err, result) {
                if(err) {
                  console.log('error making database query: ', err);
                  res.sendStatus(500);
                } else {
                  res.sendStatus(200);
                }
              }); // end client.query
            }
          }); // end client.query
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.post

// get attachments from db and add to dom
router.get('/getAttachments/:id', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  var songId = req.params.id;
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM images LEFT JOIN images_songs ON images_songs.image_id = images.id WHERE song_id = $1 AND is_notation = FALSE;', [songId], function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(404);
        } else {
          res.send(result.rows);
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

router.get('/getNotation/:id', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  var songId = req.params.id;
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM images LEFT JOIN images_songs ON images_songs.image_id = images.id WHERE song_id = $1 AND is_notation = TRUE;', [songId], function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(404);
        } else {
          res.send(result.rows);
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

// get single song from db for view
router.get('/singleSong/:id', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  var songId = req.params.id;
  console.log('songId', songId);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT songs.id, song_collection_teachable_elements.teachable_elements_id, teachable_elements_options.teachable_elements, song_title, tone_set, scale_mode_id, rhythm, extractable_rhythms, extractable_melodies, meter_id, verses_note, formation_note, action_note, intervals_note_groups, phrases, melodic_form, rhythmic_form, form_type_id, song_type_id, culture_origin, language_id, csp, other_note, source_note, user_id FROM songs LEFT JOIN song_collection_teachable_elements ON song_collection_teachable_elements.song_id=songs.id LEFT JOIN teachable_elements_options ON song_collection_teachable_elements.teachable_elements_id = teachable_elements_options.id WHERE songs.id = $1;', [songId], function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows[0]);
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

router.post('/newSong', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  var songObject = req.body;
  console.log('songObject', songObject);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('INSERT INTO songs (song_title, tone_set, scale_mode_id, rhythm, extractable_rhythms, extractable_melodies, meter_id, verses_note, formation_note, action_note, intervals_note_groups, phrases, melodic_form, rhythmic_form, form_type_id, song_type_id, culture_origin, language_id, csp, other_note, source_note, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) returning id;', [songObject.title, songObject.toneSet, songObject.scaleMode.id, songObject.rhythm, songObject.extractableRhythms, songObject.extractableMelodies, songObject.meter.id, songObject.verses, songObject.formation, songObject.action, songObject.intervalsNoteGroups, songObject.phrases, songObject.melodicForm, songObject.rhythmicForm, songObject.formType.id, songObject.songType.id, songObject.cultureOrigin, songObject.language.id, songObject.csp, songObject.other, songObject.source, userId], function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          var returningSongId = result.rows[0].id;

          if(songObject.teachableElementsModel.length > 0) {
            var sqlCounter = 2;
            var valueString = '';
            var insertArray = [returningSongId];

            for (var i = 0; i < songObject.teachableElementsModel.length; i++) {
              valueString += ('($1,$' + sqlCounter +')');
              if (i < songObject.teachableElementsModel.length-1) {
                valueString+= ', ';
              }
              insertArray.push(songObject.teachableElementsModel[i].id);
              sqlCounter++;
            }
            client.query('INSERT INTO song_collection_teachable_elements (song_id, teachable_elements_id) VALUES' + valueString + ';', insertArray, function(err,result) {
              done();
              if(err) {
                console.log('error making database query: ', err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            }); // end client.query
          }
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

router.delete('/removeSong/:id', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  var songId = req.params.id;
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('DELETE FROM songs WHERE id = $1 AND user_id = $2;', [songId, userId], function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      }); // end client.query
    }
  }); // end pool.connect
}); // end router.delete
module.exports = router;
