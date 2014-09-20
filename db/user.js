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
    //     return isValidCredentials;
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
                    callback({ "success": err });
                }

                callback(inserted);
            });
        });
    });
}

module.exports = {
    createUser: createUser
};
