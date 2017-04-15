var express = require('express');

var path = "evntz.herokuapp.com";


var emailMessage = function(eventId, adminId) {
  return { // html version of our email
    message: '<div><h1>Your event has been created!</h1>\n\n' +
    '<p>Share this link to invite your friends: ' +
    '<a href="http://' + path + '/#!/' + eventId + '">' + 'http://' + path + '/#!/' + eventId + '</a></p>\n\n' +
    'Anyone with this link can modify your event. <b>Do not share this link!</b> ' +
    '<a href="http://' + path + '/#!/' + eventId + '/' + adminId +'">' + 'http://' + path + '/#!/' + eventId + '/' + adminId + '</a></p>'
  };
};


module.exports = emailMessage;
