'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const MeetupController =  require('./src/controllers/meetup');
const config = require('./config.js'); // remove .example from /server/config.js.example
//const MongoDBUrl = 'mongodb://localhost:27017/meetupapi';
const MongoDBUrl = 'mongodb://coding-saints:952015start@ds029338.mlab.com:29338/meet';
var port = 3333 || process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// @TODO: Remove .example from /server/config.js.example
// and update with your proper Auth0 information
const authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${config.CLIENT_DOMAIN}/.well-known/jwks.json`
    }),
    // This is the identifier we set when we created the API
    audience: config.AUTH0_AUDIENCE,
    issuer: `https://${config.CLIENT_DOMAIN}/`,
    algorithms: ['RS256']
});
var uri = "mongodb+srv://coding-saints:q9w40589q@cluster0-oqyzm.mongodb.net/Cluster0"
MongoClient.connect(uri, function(err, client) {
   const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   client.close();
});


app.post('/api/meetups', MeetupController.create);
app.get('/api/meetups/public', MeetupController.getPublicMeetups);
app.get('/api/meetups/private', authCheck, MeetupController.getPrivateMeetups);

app.listen(port);
console.log('Listening on localhost');
 // Once started, connect to Mongo through Mongoose
mongoose.connect(MongoDBUrl, {}).then(() => { console.log(`Connected to Mongo server`) }, err => { console.log(err) });