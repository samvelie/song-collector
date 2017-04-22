var express = require('express');
var router = express.Router();
var pg = require('pg');

var pool = require('../modules/pg-pool');

router.get('/', function(req, res) {
  console.log('hit /users router.get, have this user info:', req.userInfo);
  res.send(req.userInfo);
});

router.get('/allUsers', function(req, res) {
  console.log('hit get all users route');
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT * FROM users ORDER BY users.is_active DESC;', function(err, result) {
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
});

router.put('/editUserAdminStatus/:id', function(req, res) {
  var userIdToEdit = req.params.id;
  var newAdminStatus = req.body.newStatus;
  console.log(newAdminStatus);
  console.log('userIdToEdit', userIdToEdit);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('SELECT COUNT(*) FROM users WHERE is_admin = true;', function(err, result) {
        done();
        if(err) {
          console.log('error making database query: ', err);
          res.sendStatus(500);
        } else if(result.rows[0].count > 1 && newAdminStatus === false) {
          console.log('addminstatus', newAdminStatus);
          var adminCount = result.rows[0];
          console.log('adminCount more than 1', adminCount);
          client.query('UPDATE users SET is_admin = $1 WHERE users.id = $2 ;', [newAdminStatus, userIdToEdit], function(err, result) {
            done();
            if(err) {
              console.log('error making database query: ', err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          }); // end client.query
        } else if(result.rows[0].count <= 1 && newAdminStatus === true) {
          var adminCount = result.rows[0];
          console.log('adminstatus', newAdminStatus);
          console.log('adminCount more than 1 & admin status is true', adminCount);
          client.query('UPDATE users SET is_admin = $1 WHERE users.id = $2 ;', [newAdminStatus, userIdToEdit], function(err, result) {
            done();
            if(err) {
              console.log('error making database query: ', err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          }); // end client.query
        } else {
          var adminCount = false;
          console.log('adminCount less than 1', adminCount);
          res.send(adminCount);
        }
      }); // end client.query
    }
  }); // end pool.connect
});

router.put('/editUserActiveStatus/:id', function(req, res) {
  var userIdToEdit = req.params.id;
  var newActiveStatus = req.body.newStatus;
  console.log('userIdToEdit', userIdToEdit);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('error connecting to the database: ', err);
      res.sendStatus(500);
    } else {
      client.query('UPDATE users SET is_active = $1 WHERE users.id = $2;', [newActiveStatus, userIdToEdit], function(err, result) {
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
});
module.exports = router;
