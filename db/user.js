var bcrypt = require('bcrypt-nodejs');

function isValidUsername(un) {
    var rx = /[A-Za-z0-9_-.]*{8, 28}/;
    var matches =  un.match(rx);

    if(matches.length != 1 || un.length() < 8 || un.length > 28) {
        return {
            "success": false,
            "error": "Username must be between 8 and 28 characters, contain only alphanumeric characters, periods or underscores ( . or _ )"
        }
    }

    return{
        "success": true
    }
}

function isValidPassword(pw) {
    console.log(pw);
    var rx = /[^s]/;
    var matches =  pw.match(rx);
    console.log(matches)

    if(!matches || matches.length != 1 || pw.length < 8 || pw.length > 28) {
        return {
            "success": false,
            "error": "Password must be between 8 and 28 characters and cannot contain whitespace"
        }
    }

    return{
        "success": true
    }
}

function isValidEmail(em) {
    var rx = /[\S+@\S+\.\S+]/;
    var matches =  em.match(rx);

    if(matches.length != 1) {
        return {
            "success": false,
            "error": "Please enter a valid email address"
        }
    }

    return{
        "success": true
    }
}

function isValidCredentials(username, email, password) {
    var isValidPassword = isValidPassword(password);
    if(!isValidPassword.success) {
        return {
            "success": false,
            "error": isValidPassword.error,
            "errorType": "invalidField"
        };
    }

    var isValidUsername = isValidUsername(username);
    if(!isValidUsername.success) {
        return {
            "success": false,
            "error": isValidUsername.error,
            "errorType": "invalidField"
        };
    }

    var isValidEmail = isValidEmail(email);
    if(!isValidEmail.success) {
        return {
            "success": false,
            "error": isValidEmail.error,
            "errorType": "invalidField"
        };
    }

    return {
        "success": true
    }
}

function createUser(db, username, email, password, callback) {
    doesUserExist(db, username, function(userExists) {
        if (userExists) {
            callback({
                "success": false,
                "error": "A user with this username already exists"
            });
        } else {
            // var isValidCredentials = isValidCredentials(username, email, password);
            // if(!isValidCredentials.success) {
            //     callback(isValidCredentials);
            // }

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, null, function(err, hash) {
                    var user = {
                        "username": username,
                        "password": hash,
                        "email": email,
                        "createdOn": Date.now(),
                        "votes": {
                            "postUpvotes": 0,
                            "postDownvotes": 0,
                            "commentUpvotes": 0,
                            "commentDownvotes": 0
                        }
                    };

                    db.collection('users').insert(user, function(err, inserted) {
                        if(err) {
                            callback({
                                "success": false,
                                "error": err,
                                "errorType": "database"
                                });
                        }

                        var insertedUser = inserted[0];
                        insertedUser.success = true;
                        callback(insertedUser);
                    });
                });
            });
        }
    });
}

function deleteUser(db, userId, callback) {
    db.collection('users').remove({_id: userId}, function(err, removed) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
        }

        removed.success = true;
        callback(removed);
    });
}

function editUser(db, userId, newCredentials, callback) {
    var modifiedUser = {"$set": {}};

    if(newCredentials.username) {
        // var isValidEmail = isValidEmail(email);
        // if(!isValidEmail.success) {
            // callback(isValidPassword);
        // } else {
            modifiedUser['$set'].username = newCredentials.username;
        // }
    }

    if(newCredentials.email) {
        // var isValidEmail = isValidEmail(email);
        // if(!isValidEmail.success) {
            // callback(isValidPassword);
        // } else {
            modifiedUser['$set'].email = newCredentials.email;
        // }
    }

    if(newCredentials.password) {
        // var isValidPassword = isValidPassword(newCredentialspassword);
        // if(!isValidPassword.success) {
            // callback(isValidPassword);
        // } else {
            hash = bcrypt.hashSync(newCredentials.password, bcrypt.genSaltSync(10));
            modifiedUser['$set'].password = hash;
        // }
    }

    db.collection('users').update({_id: userId}, modifiedUser, function(err, updated) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
        }

        updated.success = true;
        callback(updated);
    });
}

function getUser(db, userId, callback) {
    db.collection('users').find({_id: userId}, function(err, user) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
        }

        user.success = true;
        callback(user)
    });
}

function doesUserExist(db, username, callback) {
    // TODO both username AND email should be checked for duplicates
    db.collection('users').findOne({ "username": username }, function(err, result) {
        if(err) {
            callback(err);
        }

        if(result) {
            callback(true);
        } else {
            callback(false);
        }

    });
}

function authenticateUser(db, username, password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, null, function(err, hash) {
            db.collection('users').find({ "username": username, "password": hash }, function(err, result) {
                if(err) {
                    callback(err);
                }

                if(result) {
                    result.success = true;
                    callback(result);
                } else {
                    callback({
                        "success": false,
                        "error": "A use with this username/password does not exist.",
                        "errorType": "authentication"
                    });
                }

            });
        });
    });
}

function incrementPostUpvotes(db, userId, callback) {
    db.collection('users').update({ "_id": userId }, { "$inc": { "votes.$.postUpvotes": 1 } }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
        }

        result.success = true;
        callback(result);
    });
}

function decrementPostUpvotes(db, userId, callback) {
    db.collection('users').update({ "_id": userId }, { "$inc": { "votes.$.postUpvotes": -1 } }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
        }

        result.success = true;
        callback(result);
    });
}

function incrementCommentUpvotes(db, userId, callback) {
    db.collection('users').update({ "_id": userId }, { "$inc": { "votes.$.commentUpvotes": 1 } }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
        }

        result.success = true;
        callback(result);
    });
}

function decrementCommentUpvotes(db, userId, callback) {
    db.collection('users').update({ "_id": userId }, { "$inc": { "votes.$.commentUpvotes": -1 } }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
        }

        result.success = true;
        callback(result);
    });
}





function incrementPostDownvotes(db, userId, callback) {
    db.collection('users').update({ "_id": userId }, { "$inc": { "votes.$.postDownvotes": 1 } }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
        }

        result.success = true;
        callback(result);
    });
}

function decrementPostDownvotes(db, userId, callback) {
    db.collection('users').update({ "_id": userId }, { "$inc": { "votes.$.postDownvotes": -1 } }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
        }

        result.success = true;
        callback(result);
    });
}

function incrementCommentDownvotes(db, userId, callback) {
    db.collection('users').update({ "_id": userId }, { "$inc": { "votes.$.commentDownvotes": 1 } }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
        }

        result.success = true;
        callback(result);
    });
}

function decrementCommentDownvotes(db, userId, callback) {
    db.collection('users').update({ "_id": userId }, { "$inc": { "votes.$.commentDownvotes": -1 } }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
        }

        result.success = true;
        callback(result);
    });
}

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    editUser: editUser,
    getUser: getUser,
    doesUserExist: doesUserExist,
    authenticateUser: authenticateUser,
    incrementPostUpvotes: incrementPostUpvotes,
    decrementPostUpvotes: decrementPostUpvotes,
    incrementCommentUpvotes: incrementCommentUpvotes,
    decrementCommentUpvotes: decrementCommentUpvotes,
    incrementPostDownvotes: incrementPostDownvotes,
    decrementPostDownvotes: decrementPostDownvotes,
    incrementCommentDownvotes: incrementCommentDownvotes,
    decrementCommentDownvotes: decrementCommentDownvotes,
    isValidPassword: isValidPassword
};
