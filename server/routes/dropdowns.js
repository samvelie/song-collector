var express = require('express');
var router = express.Router();
var pg = require('pg');

var pool = require('../modules/pg-pool');

// dropdowns
// form-type dropdown
router.get('/form-type', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM form_type_options ORDER BY form_type_options.form_type ASC;', function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

// song-type dropdown
router.get('/song-type', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM song_type_options ORDER BY song_type_options.song_type ASC;', function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

// language dropdown
router.get('/language', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM language_options ORDER BY language_options.language ASC;', function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

// meter dropdown
router.get('/meter', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM meter_options ORDER BY meter_options.meter ASC;', function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

// scale-mode dropdown
router.get('/scale-mode', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM scale_mode_options ORDER BY scale_mode_options.scale_mode ASC;', function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

// teachable elements dropdown
router.get('/teachable-elements', function(req, res) {
  var userId = req.userInfo.id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM teachable_elements_options ORDER BY teachable_elements_options.teachable_elements ASC;', function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      }); // end client.query
    }
  }); // end pool.connect
}); //end router.get

router.post('/newSort/:table', function(req, res) {
  var userInfo = req.userInfo;
  var columnName = req.params.table;
  var tableName = req.params.table + '_options';
  var sortItem = req.body.newSortItem;
  console.log('user info in newsort', userInfo);
  console.log('table name',columnName, tableName);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('INSERT INTO '+ tableName + ' (' + columnName + ') VALUES ($1);', [sortItem], function(err, result) {
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
}); // end router.post

router.delete('/deleteSort/:table/:id', function(req, res) {
  var userInfo = req.userInfo;
  var columnName = req.params.table + '_options.id';
  var tableName = req.params.table + '_options';
  var songsColumnName = req.params.table + '_id';
  var deleteSortItem = req.params.id;
  console.log('table name',columnName, tableName);
  console.log('songsColumnName', songsColumnName);
  console.log('deleteSortItem', deleteSortItem);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    }
    else {
      client.query('UPDATE songs SET ' + songsColumnName +' = NULL WHERE ' + songsColumnName + ' = $1;', [deleteSortItem], function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else {
          client.query('DELETE FROM '+ tableName + ' WHERE ' + columnName + ' = $1;', [deleteSortItem], function(err, result) {
            done();
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
  }); // end pool.connect
}); // end router.post
module.exports = router;
