var url = require('url');
var pg = require('pg');

if(process.env.DATABASE_URL) {
  var params = url.parse(process.env.DATABASE_URL);
  var auth = params.auth.split(':');

  var config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true,
    max: 10, // how many connections at one time
    idleTimeoutMillis: 5000 // 30 seconds to try to connect
  };
} else {
  var config = {
    database: 'newisong', // the name of the database
    host: 'localhost', // where is your database
    port: 5432, // the port number for your database
    max: 20, // how many connections at one time
    idleTimeoutMillis: 30000 // 30 seconds to try to connect
  };
}

module.exports = new pg.Pool(config);
