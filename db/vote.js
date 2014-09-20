function voteOnPost(db, userId, postId, typeOfVote, callback) {
    var vote = {
        "postId": postId,
        "userId": userId,
        "typeOfVote": typeOfVote,
        "createdOn": Date.now()
    };

    db.collection('postVotes').insert(vote, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": database
            });
        }

        result.success = true;
        callback(result);
    });
}

function voteOnComment(db, userId, commentId, typeOfVote, callback) {
    var vote = {
        "commentId": commentId,
        "userId": userId,
        "typeOfVote": typeOfVote,
        "createdOn": Date.now()
    };

    db.collection('commentVotes').insert(vote, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": database
            });
        }

        result.success = true;
        callback(result);
    });
}

function getPostVote(db, voteId, callback) {
    db.collection('post').find({ "_id": voteId }, function(err, result) {
        find(err) {
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

};
