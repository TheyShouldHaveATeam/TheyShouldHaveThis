var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

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

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 3600000 }}));

app.listen(3000);


MongoClient.connect((process.env.MONGODB_CONNECT
        || "mongodb://localhost:27017/TSHT"), function(err, db) {
    if(err) {
        throw err;
    }

    /*dbUser.createUser(db, "Aniruddha", "rapha@email.com", "myPassword", function(user) {
        console.log(user);
    });*/

    // dbUser.deleteUser(db, new ObjectID("541d188afaf939d4ef700a36"), function(success) {
    //     console.log(success); // 1
    // });
    //
    // dbUser.editUser(db, new ObjectID("541d188afaf939d4ef700a36"), {username: "hay", password: "bae", email: "hey@bae.com.br"}, function(success) {
    //     console.log(success);
    // });

    app.get('/', function(req, res) {
        console.log('current user: ' + req.session.currentUser);
        res.render('landing');
    });

    app.post('/users', function(req, res) {
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;

        dbUser.createUser(db, username, email, password, function(response) {
            if(response.success) {
                req.session.currentUser = response._id;
                res.json({
                    id: response._id,
                    email: response.email,
                    username: response.username,
                    votes: response.votes,
                    createdOn: response.createdOn
                }, 201);
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
                    id: userId,
                    username: user.username,
                    email: user.email,
                    votes: user.votes,
                    createdOn: user.createdOn
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

    app.post('/users/login', function(req, res) {
        dbUser.doesUserExist(db, req.body.email, function(userExists) {
            if(!userExists) {
                res.send(404);
            }
            else {
                dbUser.authenticateUser(db, req.body.email, req.body.password, function(response) {
                    if(response.success) {
                        req.session.currentUser = response._id;
                        res.send({
                            id: response._id,
                            email: response.email,
                            username: response.username,
                            votes: response.votes,
                            createdOn: response.createdOn
                        }, 200);
                    }
                    else {
                        res.send(response, 401);
                    }
                });
            }
        });
    });

    app.post('/users/logout', function(req, res) {
        req.session.userId = null;
        res.send(204);
    });

    app.get('/admin', function(req, res) {
        req.session.admin = true;
        res.send('access granted');
    });

    app.get('/protected',  function(req, res) {
        if (!req.session.admin) return res.send(401);
        res.send(200);
    });
});
