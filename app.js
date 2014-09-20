var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var session = require('express-session');
var stylus = require('stylus');

var dbUser = require(__dirname + '/db/user.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(stylus.middleware({src: __dirname + '/public/styles/'}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(3000);

MongoClient.connect((process.env.MONGODB_CONNECT
        || "mongodb://localhost:27017/TSHT"), function(err, db) {
    if(err) {
        throw err;
    }

    // dbUser.createUser(db, "Rapha", "rapha@email.com", "myPassword", function(user) {
    //     console.log(user);
    // });

    // dbUser.deleteUser(db, new ObjectID("541d188afaf939d4ef700a36"), function(success) {
    //     console.log(success); // 1
    // });

    // dbUser.editUser(db, new ObjectID("541d188afaf939d4ef700a36"), {username: "hay", password: "bae", email: "hey@bae.com.br"}, function(success) {
    //     console.log(success);
    // });

    app.get('/', function(req, res) {
        res.render('landing');
    });


    app.post('/users', function(req, res) {
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;

        dbUser.createUser(db, username, email, password, function(response) {
            if(response.success) {
                res.json(response, 201);
            } else {
                res.json(response, 400);
            }
        });
    });

    app.get('/users/:id', function(req, res) {
        var userId = req.params.id;

        dbUser.getUser(db, userId, function(user) {
            if(user.success) {
                var cleanUser = {
                    "_id": userId,
                    "username": user.username,
                    "email": user.email,
                    "createdOn": user.createdOn,
                    "votes": user.votes
                };

                res.json(cleanUser, 200);
            } else {
                res.json(user, 400);
            }
        });
    });

    app.put('/users/:id', function(req, res) {
        var userId = req.params.id;

        var newCredentials = {};
        if(req.body.username) {
            newCredentials.username = req.body.username;
        }
        if(req.body.email) {
            newCredentials.email = req.body.email;
        }
        if(req.body.password) {
            newCredentials.password = req.body.password;
        }

        dbUser.editUser(db, userId, newCredentials, function(response) {
            if(response.success) {
                res.json(response, 200);
            } else {
                res.json(response, 400);
            }
        });
    });

    app.delete('/users/:id', function(req, res) {
        var userId = req.params.id;

        dbUser.deleteUser(db, userId, function(response) {
            if(response.success) {
                res.json(response, 200);
            } else {
                res.json(response, 400);
            }
        });
    });
});
