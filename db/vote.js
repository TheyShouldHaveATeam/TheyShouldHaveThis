function voteOnPost(db, userId, postId, typeOfVote, callback) {
    db.collection('postVotes').find({ "postId": postId, "userId": userId }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
            return;
        }

        if(result) {
            if(result.typeOfVote == typeOfVote) {
                //delete this vote
                db.collection('postVotes').remove({ "_id": result._id }, function(err, removed) {
                    if(err) {
                        callback({
                            "success": false,
                            "error": err,
                            "errorType": "database"
                        });
                        return;
                    }

                    removed.success = true;
                    callback({ "success": true });
                });
            } else {
                //update typeOfVote
                db.collection('postVotes').update({ "_id": result._id }, { "$set": { "typeOfPost": typeOfPost } }, function(err, removed) {
                    if(err) {
                        callback({
                            "success": false,
                            "error": err,
                            "errorType": "database"
                        });
                        return;
                    }

                    removed.success = true;
                    callback(removed);
                });
            }
        } else {
            //create vote
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
                        "errorType": "database"
                    });
                    return;
                }

                result.success = true;
                callback(result);
            });
        }
    });
}

function voteOnComment(db, userId, commentId, typeOfVote, callback) {
    db.collection('commentVotes').find({ "commentId": commentId, "userId": userId }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
            return;
        }

        if(result) {
            if(result.typeOfVote == typeOfVote) {
                //delete this vote
                db.collection('commentVotes').remove({ "_id": result._id }, function(err, removed) {
                    if(err) {
                        callback({
                            "success": false,
                            "error": err,
                            "errorType": "database"
                        });
                        return;
                    }

                    callback({ "success": true });
                });
            } else {
                //update typeOfVote
                db.collection('commentVotes').update({ "_id": result._id }, { "$set": { "typeOfPost": typeOfPost } }, function(err, removed) {
                    if(err) {
                        callback({
                            "success": false,
                            "error": err,
                            "errorType": "database"
                        });
                        return;
                    }

                    removed.success = true;
                    callback(removed);
                });
            }
        } else {
            //create vote
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
                        "errorType": "database"
                    });
                    return;
                }

                result.success = true;
                callback(result);
            });
        }
    });
}

function getPostVote(db, voteId, callback) {
    db.collection('postVotes').find({ "_id": voteId }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
            return;
        }

        result.success = true;
        callback(result);
    });
}

function getCommentVote(db, voteId, callback) {
    db.collection('commentVotes').find({ "_id": voteId }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
            return;
        }

        result.success = true;
        callback(result);
    });
}

module.exports = {
    getPostVote: getPostVote,
    getCommentVote: getCommentVote,
    voteOnComment: voteOnComment,
    voteOnPost: voteOnPost
};
