var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var emailMessage = require('./routes/email-message');
var gmailpass = require('./routes/gmailpass');

var message = {};

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

router.post('/', function(req, res) {
  var emailAddress = req.body.emailAddress;
    console.log(emailAddress);
    message = {
      to: emailAddress,
      subject: 'New song from iSongCollect',
      text: 'message',
      html: emailMessage(imageId).message
    };
    transporter.sendMail(message, function(error, info){ // sends on server start -- send on button click?
      if(error){
        console.log(error);
        res.sendStatus(500);
      } else {
        console.log('Message sent: ' + info.response);
        console.log(message);
        res.sendStatus(200);
      }
    });
  });
}); // end router.post

module.exports = router;
