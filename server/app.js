var port = 5812;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var decoder = require('./modules/decoder');
var users = require('./routes/users');
var songs = require('./routes/songs');
var dropdowns = require('./routes/dropdowns');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var email = require('./routes/email');
var aws = require('aws-sdk');
require('dotenv').config();

app.engine('html', require('ejs').renderFile);

var S3_BUCKET = process.env.S3_BUCKET || 'isongcollect-notation';

app.get('/sign-s3', function(req, res){
  var s3 = new aws.S3({
    region: 'us-east-2'
  });
  var fileName = req.query['file-name'];
  var fileType = req.query['file-type'];
  var s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3Params, function(err, data){
    if(err){
      console.log(err);
      return res.end();
    }
    var returnData = {
      signedRequest: data,
      url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + fileName
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

app.post('/save-details', function(req, res) {
  console.log('posting');
  console.log('s3-bucket', S3_BUCKET);
});
// uses
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(path.resolve('./server/public/views/index.html'));
});

app.use(express.static('server/public'));

// spin up server
console.log('listening on port 5812');
app.listen(process.env.PORT || 5812);

// Decodes the token in the request header and attaches the decoded token to req.decodedToken on the request
app.use(decoder.token);

//routes
app.use('/email', email);
app.use('/dropdowns', dropdowns);
app.use('/users', users);
app.use('/songs', songs);
// app.use('/email', email);
