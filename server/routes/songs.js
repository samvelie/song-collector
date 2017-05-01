var express = require('express');
var router = express.Router();
var pg = require('pg');
// var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');
// var emailMessage = require('./email-message');
// var gmailpass = require('./gmailpass');

var pool = require('../modules/pg-pool');

router.get('/', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT songs.id, songs.song_title, songs.tone_set, scale_mode_options.scale_mode, songs.rhythm, songs.extractable_rhythms, songs.extractable_melodies, meter_options.meter, songs.verses_note, songs.formation_note, songs.action_note, songs.intervals_note_groups, songs.phrases, songs.melodic_form, songs.rhythmic_form, form_type_options.form_type, song_type_options.song_type, songs.culture_origin, language_options.language, songs.csp, songs.other_note, songs.source_note FROM songs LEFT JOIN meter_options ON songs.meter_id = meter_options.id LEFT JOIN scale_mode_options ON songs.scale_mode_id = scale_mode_options.id LEFT JOIN form_type_options ON songs.form_type_id=form_type_options.id LEFT JOIN song_type_options ON songs.song_type_id = song_type_options.id LEFT JOIN language_options ON songs.language_id = language_options.id WHERE user_id=$1 ORDER BY songs.song_title ASC;', [userId], function(err, result) {
        done();
        if (err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          var allSongs = result.rows;
          client.query('SELECT teachable_elements_options.teachable_elements,teachable_elements_options.id  AS teid, songs.id FROM teachable_elements_options LEFT JOIN song_collection_teachable_elements ON song_collection_teachable_elements.teachable_elements_id = teachable_elements_options.id LEFT JOIN songs ON songs.id = song_collection_teachable_elements.song_id WHERE songs.user_id = $1;', [userId], function(err, result) {
            // console.log('all these things', result.rows);

            for (var j = 0; j < allSongs.length; j++) {
              allSongs[j].teachableElements = [];

              for (var i = 0; i < result.rows.length; i++) {
                // console.log((result.rows[i].id));
                if (result.rows[i].id == allSongs[j].id) {
                  allSongs[j].teachableElements.push({
                    teachable_elements: (result.rows[i].teachable_elements),
                    id: (result.rows[i].teid)
                  });
                }
              }
            }

            // for(var j = 0; j < allSongs.length; j++) {
            //   allSongs[j].teachableElements = [];
            //
            //   for (var i = 0; i < result.rows.length; i++) {
            //     // console.log((result.rows[i].id));
            //     if(result.rows[i].id == allSongs[j].id) {
            //       allSongs[j].teachableElements.push({teachable_elements: (result.rows[i].teachable_elements), id: (result.rows[i].teid)});
            //     }
            //   }
            // }
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
  var imageObject = req.body.list;
  var isNotation = req.body.isNotation;
  var songId = req.params.id;
  console.log('imageObject: ', imageObject);
  console.log('isNotation: ', isNotation);
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('WITH new_image_id AS (INSERT INTO images (image_file_name, image_type, image_size, image_url, image_handle, is_notation) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id) INSERT INTO images_songs (image_id, song_id, user_id) VALUES ((SELECT id FROM new_image_id), $7, $8);', [imageObject[0].filename, imageObject[0].mimetype, imageObject[0].size, imageObject[0].url, imageObject[0].handle, isNotation, songId, userId], function(err, result) {
        done();
        if (err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
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
    if (err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM images LEFT JOIN images_songs ON images_songs.image_id = images.id WHERE song_id = $1 AND is_notation = FALSE AND user_id = $2;', [songId, userId], function(err, result) {
        done();
        if (err) {
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
    if (err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM images LEFT JOIN images_songs ON images_songs.image_id = images.id WHERE song_id = $1 AND is_notation = TRUE AND user_id = $2;', [songId, userId], function(err, result) {
        done();
        if (err) {
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
    if (err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT songs.id, song_title, tone_set, scale_mode, scale_mode_id, rhythm, extractable_rhythms, extractable_melodies, meter, meter_id, verses_note, formation_note, action_note, intervals_note_groups, phrases, melodic_form, rhythmic_form, form_type, form_type_id, song_type, song_type_id, culture_origin, language, language_id, csp, other_note, source_note, user_id FROM songs LEFT JOIN form_type_options ON songs.form_type_id = form_type_options.id LEFT JOIN meter_options ON songs.meter_id = meter_options.id LEFT JOIN scale_mode_options ON songs.scale_mode_id = scale_mode_options.id LEFT JOIN song_type_options ON songs.song_type_id = song_type_options.id LEFT JOIN language_options ON songs.language_id = language_options.id WHERE songs.id = $1 AND songs.user_id=$2;', [songId, userId], function(err, result) {
        // works even though my linter is happy
        done();
        if (err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          var songObject = result.rows[0];
          client.query('SELECT songs.id, array_agg(teachable_elements_options.id) AS te_id_array, array_agg(teachable_elements_options.teachable_elements) AS te_name_array FROM songs LEFT JOIN song_collection_teachable_elements ON song_collection_teachable_elements.song_id=songs.id LEFT JOIN teachable_elements_options ON song_collection_teachable_elements.teachable_elements_id=teachable_elements_options.id WHERE songs.id=$1 AND songs.user_id=$2 GROUP BY songs.id;', [songId, userId], function(err, result) {
            if (err) {
              console.log('error making database query: ', err);
              res.sendStatus(500);
            } else {
              // console.log('songObject right here', songObject);
              console.log('te query result', result.rows[0]);
              var teIdArray = result.rows[0].te_id_array;
              var teNameArray = result.rows[0].te_name_array;
              var oneSongTeachableElementsArray = [];
              var teachableElementsIdGroup = [];
              for (var i = 0; i < teIdArray.length; i++) {
                oneSongTeachableElementsArray.push({
                  id: teIdArray[i],
                  teachable_elements: teNameArray[i]
                });
                teachableElementsIdGroup.push({
                  id: teIdArray[i]
                });
              }

              songObject.teachable_elements = oneSongTeachableElementsArray;
              songObject.teachable_elements_id_group = teachableElementsIdGroup;
              console.log(songObject);
              res.send(songObject);
            }
          });
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
    if (err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('INSERT INTO songs (song_title, tone_set, scale_mode_id, rhythm, extractable_rhythms, extractable_melodies, meter_id, verses_note, formation_note, action_note, intervals_note_groups, phrases, melodic_form, rhythmic_form, form_type_id, song_type_id, culture_origin, language_id, csp, other_note, source_note, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) returning id;', [songObject.title, songObject.toneSet, songObject.scaleMode, songObject.rhythm, songObject.extractableRhythms, songObject.extractableMelodies, songObject.meter, songObject.verses, songObject.formation, songObject.action, songObject.intervalsNoteGroups, songObject.phrases, songObject.melodicForm, songObject.rhythmicForm, songObject.formType, songObject.songType, songObject.cultureOrigin, songObject.language, songObject.csp, songObject.other, songObject.source, userId], function(err, result) {
        done();
        if (err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          var returningSongId = result.rows[0];

          if (songObject.teachableElementsModel.length > 0) {
            var sqlStringObject = buildSqlForTeachableElements(songObject.teachableElementsModel, returningSongId.id);

            client.query('INSERT INTO song_collection_teachable_elements (song_id, teachable_elements_id) VALUES' + sqlStringObject.valueString + ';', sqlStringObject.insertArray, function(err, result) {
              done();
              if (err) {
                console.log('error making database query: ', err);
                res.sendStatus(500);
              }
            }); // end client.query
          } else {
            res.send(returningSongId);
          }
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

router.put('/editSong/:id', function(req, res) {
  var userId = req.userInfo.id;
  var songObject = req.body;
  var songIdToUpdate = req.params.id;

  pool.connect(function(err, client, done) {
    if (err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('UPDATE songs SET song_title=$1, tone_set=$2, scale_mode_id=$3, rhythm=$4, extractable_rhythms=$5, extractable_melodies=$6, meter_id=$7, verses_note=$8, formation_note=$9, action_note=$10, intervals_note_groups=$11, phrases=$12, melodic_form=$13, rhythmic_form=$14, form_type_id =$15, song_type_id=$16, culture_origin=$17, language_id=$18, csp=$19, other_note=$20, source_note=$21 WHERE id=$22 AND user_id=$23;', [songObject.song_title, songObject.tone_set, songObject.scale_mode_id, songObject.rhythm, songObject.extractable_rhythms, songObject.extractable_melodies, songObject.meter_id, songObject.verses_note, songObject.formation_note, songObject.action_note, songObject.intervals_note_groups, songObject.phrases, songObject.melodic_form, songObject.rhythmic_form, songObject.form_type_id, songObject.song_type_id, songObject.culture_origin, songObject.language_id, songObject.csp, songObject.other_note, songObject.source_note, songIdToUpdate, userId], function(err, result) {
        done();
        if (err) {
          console.log('error making db query', err);
          res.sendStatus(500);
        } else {
          client.query('DELETE FROM song_collection_teachable_elements WHERE song_id=$1', [songIdToUpdate], function(err, result) {
            if (err) {
              console.log('error deleting in db prior to inserting new elements', err);
              res.sendStatus(500);
            } else {
              if (songObject.teachable_elements_id_group.length > 0) {
                var sqlStringObject = buildSqlForTeachableElements(songObject.teachable_elements_id_group, songIdToUpdate);
                client.query('INSERT INTO song_collection_teachable_elements (song_id, teachable_elements_id) VALUES' + sqlStringObject.valueString + ';', sqlStringObject.insertArray, function(err, result) {
                  done();
                  if (err) {
                    console.log('error making database query: ', err);
                    res.sendStatus(500);
                  } else {
                    res.sendStatus(200);
                  }
                }); // end client.query for insert
              } else {
                res.sendStatus(200);
              }

            }
          });
        }
      }); //end client.query for update
    }
  }); //end pool.connect for edit song
}); //router.put for single song

router.post('/editSong/:id', function(req, res) {
  var userId = req.userInfo.id;
  var songObject = req.body;
  var songIdToUpdate = req.params.id;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('UPDATE songs SET song_title=$1, tone_set=$2, scale_mode_id=$3, rhythm=$4, extractable_rhythms=$5, extractable_melodies=$6, meter_id=$7, verses_note=$8, formation_note=$9, action_note=$10, intervals_note_groups=$11, phrases=$12, melodic_form=$13, rhythmic_form=$14, form_type_id =$15, song_type_id=$16, culture_origin=$17, language_id=$18, csp=$19, other_note=$20, source_note=$21 WHERE id=$22 AND user_id=$23;', [songObject.song_title, songObject.tone_set, songObject.scale_mode_id, songObject.rhythm, songObject.extractable_rhythms, songObject.extractable_melodies, songObject.meter_id, songObject.verses_note, songObject.formation_note, songObject.action_note, songObject.intervals_note_groups, songObject.phrases, songObject.melodic_form, songObject.rhythmic_form, songObject.form_type_id, songObject.song_type_id, songObject.culture_origin, songObject.language_id, songObject.csp, songObject.other_note, songObject.source_note, songIdToUpdate, userId], function(err, result) {
        done();
        if (err) {
          console.log('error making db query', err);
          res.sendStatus(500);
        } else {
          client.query('DELETE FROM song_collection_teachable_elements WHERE song_id=$1', [songIdToUpdate], function(err, result) {
            if (err) {
              console.log('error deleting in db prior to inserting new elements', err);
              res.sendStatus(500);
            } else {
              var sqlStringObject = buildSqlForTeachableElements(songObject.teachable_elements, songIdToUpdate);
              client.query('INSERT INTO song_collection_teachable_elements (song_id, teachable_elements_id) VALUES' + sqlStringObject.valueString + ';', sqlStringObject.insertArray, function(err, result) {
                done();
                if (err) {
                  console.log('error making database query: ', err);
                  res.sendStatus(500);
                } else {
                  res.sendStatus(200);
                }
              }); // end client.query for insert
            }
          });
        }
      }); //end client.query for update
    }
  }); //end pool.connect for edit song
}); //router.put for single song


router.delete('/removeSong/:id', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  var songId = req.params.id;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('DELETE FROM song_collection_teachable_elements WHERE song_id = $1;', [songId], function(err, result) {
        done();
        if (err) {
          console.log('error making database query: ', err);
        }
      }); // end client.query
      client.query('DELETE FROM images_songs WHERE song_id = $1 AND user_id = $2 RETURNING images_songs.image_id;', [songId, userId], function(err, result) {
        done();
        if (err) {
          console.log('error making database query: ', err);
        } else {
          if (result.rows > 0) {
            var deletedImageId = result.rows[0].image_id;
            client.query('DELETE FROM images WHERE image.id = $1;', [deletedImageId], function(err, result) {
              if (err) {
                console.log('error making database query: ', err);
              } else {
                client.query('DELETE FROM songs WHERE id = $1 AND user_id = $2;', [songId, userId], function(err, result) {
                  done();
                  if (err) {
                    console.log('error making database query: ', err);
                    res.sendStatus(500);
                  } else {
                    res.sendStatus(200);
                  }
                }); // end client.query
              }
            });
          } else {
            client.query('DELETE FROM songs WHERE id = $1 AND user_id = $2;', [songId, userId], function(err, result) {
              done();
              if (err) {
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
}); // end router.delete


// start nodemailer-smtp-transport
// var transporter = nodemailer.createTransport(smtpTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'isongcollect@gmail.com',
//     pass: gmailpass().password
//   }
// }));
//
// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Server is ready to take our messages');
//   }
// });
// end nodemailer-smtp-transport

// router.post('/shareSong', function(req, res) {
//   var emailAddress = req.body.emailAddress;
//   var imageId = req.body.imageId;
//   console.log(emailAddress);
//   message = {
//     to: emailAddress,
//     subject: 'New song from iSongCollect',
//     text: 'message',
//     html: emailMessage(imageId).message
//   };
//   transporter.sendMail(message, function (error, info) { // sends on server start -- send on button click?
//     if (error) {
//       console.log(error);
//       res.sendStatus(500);
//     } else {
//       console.log('Message sent: ' + info.response);
//       console.log(message);
//       // res.sendStatus(200);
//       res.send(200);
//     }
//   });
//     transporter.sendMail(message, function(error, info){ // sends on server start -- send on button click?
//       if(error){
//         console.log(error);
//         res.sendStatus(500);
//       } else {
//         console.log('Message sent: ' + info.response);
//         console.log(message);
//         res.sendStatus(200);
//       }
//     });
//   });
// }); // end router.post


function buildSqlForTeachableElements(teachableElementArray, songId) {
  var sqlCounter = 2;
  var valueString = '';
  var insertArray = [songId];

  for (var i = 0; i < teachableElementArray.length; i++) {
    valueString += ('($1,$' + sqlCounter + ')');
    if (i < teachableElementArray.length - 1) {
      valueString += ', ';
    }
    insertArray.push(teachableElementArray[i].id);
    sqlCounter++;
  }

  return {
    valueString: valueString,
    insertArray: insertArray
  };
}

module.exports = router;
