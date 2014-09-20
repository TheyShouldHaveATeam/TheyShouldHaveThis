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
    var rx = /[^s]*{8, 28}/;
    var matches =  pw.match(rx);

    if(matches.length != 1 || pw.length() < 8 || pw.length > 28) {
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
    // var isValidCredentials = isValidCredentials(username, email, password);
    // if(!isValidCredentials.success) {
    //     callback(isValidCredentials);
    // }

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            var user = {
                "username": username,
                "password": password,
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
                        "error": err
                        });
                }

                callback(inserted);
            });
        });
    });
}

function deleteUser(db, userId, callback) {
    db.collection('users').remove({_id: userId}, function(err, removed) {
        if(err) {
            callback({
                "success": false,
                "error": err
            });
        }

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
            modifiedUser['$set'].password = newCredentials.password;
            // hash = bcrypt.hashSync(newCredentials.password, bcrypt.genSaltSync(10));
            // modifiedUser['$set'].password = hash;
        // }
    }

    db.collection('users').update({_id: userId}, modifiedUser, function(err, updated) {
        if(err) {
            callback({
                "success": false,
                "error": err
            });
        }

        callback(updated);
    });
}

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    editUser: editUser
};
