var express = require('express');

var path = "localhost:5812";


var emailMessage = function(imageId) {
  return { // html version of our email
    message: '<div><h1>New song from iSongCollect</h1>\n\n' +
    '<p>Elizabeth Johnson has shared this song with you: ' +
    '<a href="http://' + path + '/#!/' + imageId + '">' + 'http://' + path + '/#!/' + imageId + '</a></p>\n\n'
  };
};


module.exports = emailMessage;
