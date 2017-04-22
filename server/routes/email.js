var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var emailMessage = require('./email-message');
var gmailpass = require('./gmailpass');

var message = {};
var pool = require('../modules/pg-pool');

// start nodemailer-smtp-transport
var transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: {
    user: 'isongcollect@gmail.com',
    pass: 'phiprimeacademy2017'
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

console.log('log before router.post for shareSong');

router.post('/shareSong', function(req, res) {
  var emailAddress = req.body.emailAddress;
  var imageUrl = req.body.imageUrl;
  var userInfo = req.body.userInfo;
  var songName = req.body.songName;
  console.log('object in email.js', req.body);
  message = {
    to: 'veliesamr@gmail.com',
    subject: 'New song from iSongCollect',
    text: 'message',
    html: emailMessage(imageUrl, userInfo, songName).message
  };
  transporter.sendMail(message, function (error, info) { // sends on server start -- send on button click?
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      console.log('Message sent: ' + info.response);
      console.log(message);
      res.sendStatus(200);
    }
  });
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
}); // end router.post

module.exports = router;
