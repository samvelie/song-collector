var express = require('express');

var gmailpass = function () {
  return {
    password: process.env.NODEMAILER_EMAIL_PASSWORD
  };
};

module.exports = gmailpass;
