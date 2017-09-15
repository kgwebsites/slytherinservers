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
const firebaseUrl = 'https://serverless-io.firebaseio.com/';
const sparkpostSecret = 'fca6b412288aa708ab5b05d401121520c2b99b9d';
const SparkPost = require('sparkpost');
const options = {
    debut: true
};
const client = new SparkPost(sparkpostSecret, options);

// Initialize Firebase
const config = {
    apiKey: "AIzaSyBbWxwjQ_2nXgzZXTUfUjeCST_aLvoYtnw",
    authDomain: "serverless-io.firebaseapp.com",
    databaseURL: "https://serverless-io.firebaseio.com",
    projectId: "serverless-io",
    storageBucket: "serverless-io.appspot.com",
    messagingSenderId: "23294201740"
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

 //Account Username/Password Creation
 app.post('/account/create', function(req, res){
    //Validation
    req.assert('first_name', 'First Name is required').notEmpty();
    req.assert('last_name', 'Last Name is required').notEmpty();
    req.assert('email', 'Valid email is required').notEmpty().isEmail();
    req.assert('password', 'Password is required.').notEmpty();

    req.getValidationResult()
    .then(function (result) {
        //If there are no errors
        if (result.isEmpty()) {
            const account = {
                    name: {
                        first: req.body.first_name.charAt(0).toUpperCase() + req.body.first_name.slice(1),
                        last: req.body.last_name.charAt(0).toUpperCase() + req.body.last_name.slice(1)
                    },
                    email: req.body.email,
                    password: req.body.password
                }

            //Create Firebase Account
            firebase.auth().createUserWithEmailAndPassword(account.email, account.password).then(function() {
                //User created successful.
                
                //Update account with name
                const user = firebase.auth().currentUser;
                
                user.updateProfile({
                    displayName: account.name.first + ' ' + account.name.last
                }).then(function () {
                // Update successful.
                    res.json({
                        status: 200,
                        user: user
                    });
                }).catch(function (error) {
                // An error happened.
                    res.json({
                        status: 500,
                        error: error
                    });
                });

            }).catch(function (error) {
                res.json({
                    status: 500,
                    error: {
                        code: error.code,
                        msg: error.message
                    }
                });
            });

        } else {
            //Return errors
            res.json({
                status: 500,
                error: result.array(1)
            });
    }
    });
});

//Get Contact Requests

app.post('/account/requests', function (req, res) {
    //Validation
    req.assert('apiKey', 'API Key is required').notEmpty();

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
                    url: firebaseUrl + '/accounts/' + apikey + '/requests.json',
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
                var notifications = null;
                //Store notification settings
                settings.once('value', function (snapshot) {
                    notifications = snapshot.val().notifications;
                });

                if(notifications === true){

                    client.transmissions.send({
                        options: {
                            sandbox: true
                        },
                        content: {
                            from: 'testing@sparkpostbox.com',
                            subject: 'Hello, World!',
                            html: '<html><body><p>Testing SparkPost - the world\'s most awesomest email service!</p></body></html>'
                        },
                        recipients: [
                            { address: 'gosskyle93@gmail.com' }
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