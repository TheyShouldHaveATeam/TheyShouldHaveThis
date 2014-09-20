var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var session = require('express-session');
var stylus = require('stylus');

var dbUser = require(__dirname + '/db/user.js');
var dbPost = require(__dirname + '/db/post.js');
var dbComment = require(__dirname + '/db/comment.js');
var dbVote = require(__dirname + '/db/vote.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(stylus.middleware({src: __dirname + '/public/styles/'}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 3600000 }}));

app.listen(process.env.PORT || 3000);


MongoClient.connect((process.env.MONGOLAB_URI
        || "mongodb://localhost:27017/TSHT"), function(err, db) {
    if(err) {
        throw err;
    }

    // dbUser.createUser(db, "Aniruddha", "rapha@email.com", "myPassword", function(user) {
    //     console.log(user);
    // });

    // dbUser.deleteUser(db, new ObjectID("541d188afaf939d4ef700a36"), function(success) {
    //     console.log(success); // 1
    // });
    //
    // dbUser.editUser(db, new ObjectID("541d188afaf939d4ef700a36"), {username: "hay", password: "bae", email: "hey@bae.com.br"}, function(success) {
    //     console.log(success);
    // });

    app.get('/', function(req, res) {
        console.log('current user: ' + req.session.currentUser);
        res.render('landing', {title: 'They Should Have This', currentUser: req.session.currentUser});
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

    app.get('/users/:id.:format?', function(req, res) {
        var userId = new ObjectID(req.params.id);

        dbUser.getUser(db, userId, function(user) {
            if(user.success) {
                var cleanUser = {
                    id: userId,
                    username: user.username,
                    email: user.email,
                    votes: user.votes,
                    createdOn: user.createdOn
                };

                if(req.params.format === 'json') {
                    res.json(cleanUser, 200);
                } else {
                    res.render('profile', cleanUser);
                }
            } else {
                res.json(user, 400);
            }
        });
    });

    app.put('/users/:id', function(req, res) {
        var userId = new ObjectID(req.params.id);
        var loggedUserId = req.session.currentUser;

        if(loggedUserId != userId) {
            res.json({
                "success": false,
                "error": "Unmatching userIds",
                "errorType": "authentication"
            }, 400);
            return;
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
        var userId = new ObjectID(req.params.id);
        var loggedUserId = req.session.currentUser;

        if(loggedUserId !== userId) {
            res.json({
                "success": false,
                "error": "Unmatching userIds",
                "errorType": "authentication"
            }, 400);
            return;
        }

        dbUser.deleteUser(db, userId, function(response) {
            if(response.success) {
                res.json(response, 200);
            } else {
                res.json(response, 400);
            }
        });
    });

    app.get('/posts', function(req, res) {
        dbPost.getPosts(db, function(result) {
            if(result.success !== undefined) {
                res.json(result, 400);
                return;
            }
            res.json(result, 200);
        });
    });

    app.get('/posts/categories/:category.:format?', function(req, res) {
        var category = req.params.category;

        dbPost.getCategoryPosts(db, category, function(result) {
            if(result.success !== undefined) {
                res.json(result, 400);
                return;
            }
            if(req.params.format === 'json') {
                res.json(result, 200);
            } else {
                res.render('category', result);
            }
        });
    });

    app.get('/posts/user/:userId', function(req, res) {
        var userId = new ObjectID(req.params.userId);

        dbPost.getUserPosts(db, userId, function(result) {
            if(result.success !== undefined) {
                res.json(result, 400);
                return;
            }

            res.json(result, 200);
        });
    });

    app.get('/posts/:id.:format?', function(req, res) {
        var postId = new ObjectID(req.params.id);

        dbPost.getPost(db, postId, function(result) {
            if(result.success) {
                if(req.params.format === "json") {
                    res.json(result, 200);
                } else {
                    res.render('singlepost', {
                        currentPost: req.params.id
                    });
                }
            } else {
                res.json(result, 400);
            }
        });
    });

    app.delete('/posts/:id', function(req, res) {
        var postId = new ObjectID(req.params.id);
        var currentUser = new ObjectID(req.session.currentUser);

        dbPost.getPost(db, postId, function(result) {
            if(!result.success) {
                res.json(result, 400);
                return;
            }

            if(currentUser !== result.userId) {
                res.json({
                    "success": false,
                    "error": "Unmatching userIds",
                    "errorType": "authentication"
                }, 400);
                return;
            }

            dbPost.deletePost(db, postId, function(result) {
                if(!result.success) {
                    res.json(result, 400);
                    return;
                }
                res.json(result, 200);
            });
        });
    });

    app.post('/posts', function(req, res) {
        if(req.session.currentUser) {
            var userId = req.session.currentUser; //new ObjectID(req.session.currentUser);
            var idea = req.body.idea;
            var desc = req.body.desc;
            var category = req.body.category;

            dbPost.createPost(db, userId, idea, desc, category, function(result) {
                if(result.success) {
                    res.json(result, 200);
                } else {
                    res.json(result, 400);
                }
            });
        }
        else {
            res.send(401);
        }
    });

    app.get('/posts/:id/comments', function(req, res) {
        var postId = new ObjectID(req.params.id);

        dbComment.getComments(db, postId, function(result) {
            if(result.success !== undefined) {
                res.json(result, 400);
                return;
            }

            res.json(result, 200);
        });
    });

    app.get('/comments/:commentId', function(req, res) {
        var commentId = new ObjectID(req.params.commentId);

        dbComment.getComment(db, commentId, function(result) {
            if(result.success) {
                res.json(result, 200);
            } else {
                res.json(result, 400);
            }
        });
    });

    app.post('/posts/:id/comments', function(req, res) {
        var postId = new ObjectID(req.params.id);
        var userId = new ObjetcID(req.session.currentUser);
        var text = req.params.comment;
        var type = req.params.type; // must be "theyHave", "canMake" or "comment"
        if(type !== "theyHave" && type !== "canMake" && type !== "comment") {
            res.json({
                "success": false,
                "error": "Invalid Comment Type",
                "errorType": "invalidParameter"
            }, 400);
            return;
        }

        var href;
        if(req.params.href === undefined || res.params.href === "") {
            if(type === "comment") {
                href = "";
            } else {
                res.json({
                    "success": false,
                    "error": "Href is required for \"They Have This\" and \"I Can Make This\" replies",
                    "errorType": "invalidParameter"
                }, 400);
            }
        } else {
            href = req.params.href;
        }

        dbComment.createComment(db, userId, postId, text, type, href, function(result) {
            if(result.success !== undefined) {
                res.json(result, 400);
                return;
            }

            res.json(result, 200);
        });
    });

    app.delete('/comments/:commentId', function(req, res) {
        var commentId = new ObjectID(req.params.id);
        var currentUser = new ObjectID(req.session.currentUser);

        dbComment.getComment(db, commentId, function(result) {
            if(!result.success) {
                res.json(result, 400);
                return;
            }

            if(currentUser !== result.userId) {
                res.json({
                    "success": false,
                    "error": "Unmatching userIds",
                    "errorType": "authentication"
                }, 400);
                return;
            }

            dbComment.deleteComment(db, commentId, function(result) {
                if(!result.success) {
                    res.json(result, 400);
                    return;
                }
                res.json(result, 200);
            });
        });
    });

    app.post('/posts/:id/vote', function(req, res) {
        var userId = new ObjectID(req.session.currentUser);
        var postId = new Object(req.params.id);
        var typeOfVote = req.params.typeOfVote;

        if(typeOfVote !== "upvote" && typeOfVote !== "downvote") {
            res.json({
                "success": false,
                "error": "typeOfVote must be \"upvote\" or \"downvote\"",
                "errorType": "invalidParameter"
            }, 400);
            return;
        }

        dbVote.voteOnPost(db, userId, postId, typeOfVote, function(result) {
            if(!result.success) {
                res.json(result, 400);
                return;
            }

            res.json(result, 200);
        });
    });

    app.post('/comments/:id/vote', function(req, res) {
        var userId = new ObjectID(req.session.currentUser);
        var commentId = new Object(req.params.id);
        var typeOfVote = req.params.typeOfVote;

        if(typeOfVote !== "upvote" && typeOfVote !== "downvote") {
            res.json({
                "success": false,
                "error": "typeOfVote must be \"upvote\" or \"downvote\"",
                "errorType": "invalidParameter"
            }, 400);
            return;
        }

        dbVote.voteOnComment(db, userId, commentId, typeOfVote, function(result) {
            if(!result.success) {
                res.json(result, 400);
                return;
            }

            res.json(result, 200);
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
        req.session.currentUser = null;
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
