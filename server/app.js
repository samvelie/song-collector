var port = 5812;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var decoder = require('./modules/decoder');
var users = require('./routes/users');
var songs = require('./routes/songs');
// uses
app.use(bodyParser.json());
app.use(express.static('server/public'));

app.get('/', index);

// spin up server
console.log('listening on port 5812');
app.listen(process.env.PORT || 5812);

// Decodes the token in the request header and attaches the decoded token to req.decodedToken on the request
app.use(decoder.token);

//routes
app.use('/users', users);
app.use('/songs', songs);
