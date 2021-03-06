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
// var configHeroku = require('./modules/configheroku');

// uses
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(path.resolve('./server/public/views/index.html'));
});

app.use(express.static('server/public'));

// spin up server
console.log('listening on port 5812');
app.listen(process.env.PORT || 5812);

// Decodes the token in the request header and attaches the decoded token to req.decodedToken on the request
app.use(decoder.token);
// app.use(configHeroku.fileStackAPI);
// console.log('configHeroku', configHeroku);

//routes
app.use('/email', email);
app.use('/dropdowns', dropdowns);
app.use('/users', users);
app.use('/songs', songs);
