var pg = require('pg');

var fileStackAPI = {
  apiKey: process.env.FILESTACK_API || '23478392'
};

module.exports = {fileStackAPI: fileStackAPI};
