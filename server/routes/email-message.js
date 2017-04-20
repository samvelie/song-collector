var express = require('express');

var emailMessage = function(imageUrl, userInfo) {
  return { // html version of our email
    message: '<div><h1>New song from iSongCollect</h1>\n\n' +
    '<p>' + userInfo.info.user_name + ' has shared this song with you: ' +
    '<a href="' + imageUrl + '">' + imageUrl + '</a></p>\n\n'
  };
};

module.exports = emailMessage;
