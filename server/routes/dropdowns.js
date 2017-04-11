var express = require('express');
var router = express.Router();
var pg = require('pg');

var pool = require('../modules/pg-pool');

// dropdowns
// form-type dropdown
router.get('/form-type', function(req, res) {
  var userId = req.userInfo[0].id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM form_type_options;', function(err, result) {
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
  var userId = req.userInfo[0].id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM song_type_options;', function(err, result) {
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
  var userId = req.userInfo[0].id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM language_options;', function(err, result) {
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
  var userId = req.userInfo[0].id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM meter_options;', function(err, result) {
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
  var userId = req.userInfo[0].id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM scale_mode_options;', function(err, result) {
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
  var userId = req.userInfo[0].id; // will become user id pulled from decoder token
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM teachable_elements_options;', function(err, result) {
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

module.exports = router;
