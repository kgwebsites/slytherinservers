#!/usr/bin/env nodejs
/*
 *
 * Init
 * 
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const request = require('request');
const moment = require('moment');
const firebase = require("firebase");
const firebaseDBUrl = 'https://slytherin-servers.firebaseio.com/';
const firebaseAuthDomain = 'slytherin-servers.firebaseapp.com';
const sparkpostSecret = 'fca6b412288aa708ab5b05d401121520c2b99b9d';
const SparkPost = require('sparkpost');
const options = {
    debut: true
};
const client = new SparkPost(sparkpostSecret, options);

// Initialize Firebase
const config = {
    apiKey: "AIzaSyBoZTHS7flw3FeqAwlP-wUr7hORUVeh5IM",
    authDomain: firebaseAuthDomain,
    databaseURL: firebaseDBUrl,
    projectId: "slytherin-servers",
    storageBucket: "slytherin-servers.appspot.com",
    messagingSenderId: "737726446033"
};
firebase.initializeApp(config);

//Initialize Express
const app = express();
/*
 *
 * Middleware
 * 
 */

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        const namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/*
 *
 * Account Endpoints
 * 
 */

//Get Contact Requests

app.post('/account/requests', function (req, res) {
    //Validation
    console.log(req.body);
    req.assert('uid', 'API Key is required').notEmpty();

    req.getValidationResult()
        .then(function (result) {
            //If there are no errors
            if (result.isEmpty()) {
                const apiKey = req.body.uid;

                //Fetch requests from firebase account
                const contactRequests = firebase.database().ref('accounts/' + apiKey + '/requests');

                //When requests are changed update requests
                contactRequests.once('value', function (snapshot) {
                    res.json({
                        status: 200,
                        requests: snapshot
                    });
                });

            } else {
                res.json({
                    status: 500,
                    error: result.array(1)
                });
            }
        });
});


/*
 *
 * Product Endpoints
 * 
 */

//Contact Submission

app.post('/contact', function(req, res){
    //Validation
    req.assert('apikey', 'A Valid API Key is required').notEmpty();
    req.assert('first_name', 'First Name is required').notEmpty();
    req.assert('last_name', 'Last Name is required').notEmpty();
    req.assert('email', 'Valid email is required').notEmpty().isEmail();

    req.getValidationResult()
        .then(function(result) {
            //If there are no errors
            if(result.isEmpty()){
                const apikey = req.body.apikey;
                const newContactRequest = {
                    name: {
                        first: req.body.first_name,
                        last: req.body.last_name
                    },
                    email: req.body.email,
                    phone: req.body.phone,
                    subject: req.body.subject,
                    message: req.body.message,
                    date_entered: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    timestamp: 0 - moment().valueOf()
                }

                /*
                 * Insert into Firebase
                 */

                // Request Headers
                const headers = {
                    'User-Agent': 'Contact Form API/1.0.0',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
                // Request Config
                const options = {
                    url: firebaseDBUrl + '/accounts/' + apikey + '/requests.json',
                    method: 'POST',
                    headers: headers,
                    form: JSON.stringify(newContactRequest)
                }
                // Start the request
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // Print out the response body
                        const apikey = body.name
                    }
                })

                /*
                 * Notification Email
                 */

                //Check if notifications are enabled for account

                //Fetch settings from firebase account
                const settings = firebase.database().ref('accounts/' + apikey + '/settings');
                let notifications = null;

                //Store notification settings
                settings.once('value', function (snapshot) {
                    notifications = snapshot.val().notifications;
                }).then(() => {
                    if(notifications === true){
                        //Send notification email
                        client.transmissions.send({
                            options: {
                                sandbox: false
                            },
                            content: {
                                from: 'no-reply@kgwebsites.com',
                                reply_to: newContactRequest.email,
                                subject: newContactRequest.subject,
                                html: '<html><body><p>' + newContactRequest.message + '</p></body></html>'
                            },
                            recipients: [
                                { address: 'kyle@kgwebsites.com' }
                            ]
                        })
                            .then(data => {
                                console.log('Woohoo! You just sent your first mailing!');
                                console.log(data);
                            })
                            .catch(err => {
                                console.log('Whoops! Something went wrong');
                                console.log(err);
                            });

                    }
                });


                //Submit response
                res.json({status: 200, data: newContactRequest});

            } else {
                res.json({
                    status: 500,
                    error: result.array(1)
                });
            }
        });
});

app.listen(3000, function(){
    console.log('Server started on port 3000');
});
