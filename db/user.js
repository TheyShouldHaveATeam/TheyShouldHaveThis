var bcrypt = require('bcrypt');

function createUser(db, username, email, password) {
    var isValidPassword = isValidPassword(password); //returns true, or err desc
    if(!isValidPassword) {
        return {
            "error": isValidPassword,
            "errorType": "invalidField"
        };
    }

    var isValidUsername = isValidUsername(username); //returns true, or err desc
    if(!isValidUsername) {
        return {
            "error": isValidUsername,
            "errorType": "invalidField"
        };
    }

    bcrypt.genSalt(password, hash, function(err, res) {
        db.collection('users').insert();
    });
}
