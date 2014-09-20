var bcrypt = require('bcrypt');

// function isValidCredentials(username, email, password) {
//     var isValidPassword = isValidPassword(password);
//     if(!isValidPassword.success) {
//         return {
//             "success": false,
//             "error": isValidPassword.error,
//             "errorType": "invalidField"
//         };
//     }
//
//     var isValidUsername = isValidUsername(username);
//     if(!isValidUsername.success) {
//         return {
//             "success": false,
//             "error": isValidUsername.error,
//             "errorType": "invalidField"
//         };
//     }
//
//     var isValidEmail = isValidEmail(email);
//     if(!isValidEmail.success) {
//         return {
//             "success": false,
//             "error": isValidEmail.error,
//             "errorType": "invalidField"
//         };
//     }
//
//     return {
//         "success": true
//     }
// }

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
