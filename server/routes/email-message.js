var express = require('express');

var emailMessage = function(imageUrl, userInfo, songName) {
  return { // html version of our email
    message: '<div><h1>New song from iSongCollect</h1>\n\n' +
    '<p>' + userInfo.info.user_name + ' has shared the notation for \'' + songName + '\' with you!</p>\n\n' +
    '<img style="height:300px; width: auto; display:block;" src="' + imageUrl + '">Click here to download it!</img>\n\n' +
    '<p><a href="http://localhost:5812/#!/login">Click here to go to iSongCollect!</a></p>\n'
  };
};

module.exports = emailMessage;
