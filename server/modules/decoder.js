var admin = require("firebase-admin");
var pg = require('pg');

var pool = require('./pg-pool');

if(process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY) {
  admin.initializeApp({
    credential: admin.credential.cert({
      "type": process.env.FIREBASE_SERVICE_ACCOUNT_TYPE,
      "project_id": process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
      "private_key_id": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
      "private_key": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
      "client_email": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
      "auth_uri": process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
      "token_uri": process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
      "client_x509_cert_url": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL
    }),
    databaseURL: "https://isongcollect-d9234.firebaseio.com"
  });
} else {
  admin.initializeApp({
    credential: admin.credential.cert("./server/firebase-service-account.json"),
    databaseURL: "https://isongcollect-d9234.firebaseio.com"
  });
}

/* This is where the magic happens. We pull the id_token off of the request,
verify it against our firebase service account private_key.
Then we add the decodedToken */
var tokenDecoder = function (req, res, next) {
  if (req.headers.id_token) {
    admin.auth().verifyIdToken(req.headers.id_token).then(function (decodedToken) {
      // Adding the decodedToken to the request so that downstream processes can use it
      req.decodedToken = decodedToken;
      pool.connect(function (err, client, done) {
        //this user_id property on the decodedToken comes from the google auth
        var googleId = req.decodedToken.user_id;
        client.query('SELECT users.id, users.user_name, users.user_email, users.user_photo, FROM users WHERE google_id = $1;', [googleId], function (err, result) {
          done();
          if (err) {
            console.log('Error querying db for users:', err);
          } else {
            if (result.rowCount > 0) {
              console.log('rowCount > 0 on user query, user identified:', result.rows);
              req.userInfo = result.rows;
              next();
            } else {
              var userPhoto = req.decodedToken.picture;
              var userName = req.decodedToken.name;
              var userEmail = req.decodedToken.email;
              var userGoogleId = req.decodedToken.user_id;
              console.log('test userGoogleId log', userGoogleId);
              client.query('INSERT INTO users (user_name, user_photo, user_email, google_id) VALUES ($1, $2, $3, $4) RETURNING id;', [userName, userPhoto, userEmail, userGoogleId], function (err, insertResult) {
                done();
                if (err) {
                  console.log('Error adding user to db:', err);
                  res.sendStatus(500);
                } else {
                  insertResult.rows[0].user_name = userName;
                  insertResult.rows[0].user_email = userEmail;
                  insertResult.rows[0].user_photo = userPhoto;

                  console.log('user added and authenticated:', insertResult.rows);
                  req.userInfo = insertResult.rows;
                  next();
                }
              }); // end client.query
            }
          }
        }); // end client.query
      }); // end admin auth
    }) // end if
      .catch(function (error) {
        // If the id_token isn't right, you end up in this callback function
        // Here we are returning a forbidden error
        console.log('User token could not be verified', error);
        res.sendStatus(403);
      });
  } else {
    console.log('idtoken null');
    // Seems to be hit when chrome makes request for map files
    // Will also be hit when user does not send back an idToken in the header
    res.sendStatus(403);
  }
};

module.exports = { token: tokenDecoder };
