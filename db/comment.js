function getComment(db, commentId, callback) {
    db.collection('comments').findOne({"_id": commentId }, function(err, comment) {

        if(err) {
            callback({
                "success" : false,
                "error": err,
                "errorType": "database"
            });
            return;
        }

        comment.success = true;
        callback(comment);
    });
}

function createComment(db, userId, postId, text, type, href, callback) {
    var comment = {
        "userId": userId,
        "postId": postId,
        "text": text,
        "type": type,
        "href": href,
        "createdOn": Date.now(),
        "votes": {
            "upvotes": 0,
            "downvotes": 0
        }
    };

    db.collection('comments').insert(comment, function(err, inserted) {

        if(err){
            callback( {
                "success": false,
                "error": err,
                "errorType": "database"
            });
            return;
        }

        var commentTypePath = "comments$" + type;
        var toUpdate = { "$inc": { } };
        toUpdate["$inc"][commentTypePath] = 1;

        db.collection('posts').update({ "_id": postId }, toUpdate, function(err, result) {
            if(err) {
                callback({
                    "success": false,
                    "error": err,
                    "errorType": "database"
                });
                return;
            }

            inserted.success = true;
            callback(inserted);
        });
    })
}

function deleteComment(db, commentId, callback) {
    db.collection('comments').remove({ "_id": commentId }, function(err, removed) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
            return;
        }

        result.success = true;
        callback(removed);
    });
}


function getComments(db, postId, pageNumber, callback) {
    var commentsPerPage = 50;
    db.collection('posts').find({"$query": {"postId": postId}, "$orderBy": { "createdOn" : -1 } }).skip(pageNumber * commentsPerPage).limit(commentsPerPage).toArray(function(result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
            return;
        }

        callback(result);
    });
}

function incrementCommentUpvotes(db, commentId, callback) {
    db.collection('comments').update({ "_id": commentId }, { "$inc": { "votes.$.upvotes": 1 } }, function(err, result) {
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

function decrementCommentUpvotes(db, commentId, callback) {
    db.collection('comments').update({ "_id": commentId }, { "$inc": { "votes.$.upvotes": -1 } }, function(err, result) {
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

function incrementCommentDownvotes(db, commentId, callback) {
    db.collection('comments').update({ "_id": commentId }, { "$inc": { "votes.$.downvotes": 1 } }, function(err, result) {
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

function decrementCommentDownvotes(db, commentId, callback) {
    db.collection('comments').update({ "_id": commentId }, { "$inc": { "votes.$.downvotes": -1 } }, function(err, result) {
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
    getComment: getComment,
    createComment: createComment,
    deleteComment: deleteComment,
    getComments: getComments,
    incrementCommentUpvotes: incrementCommentUpvotes,
    decrementCommentUpvotes: decrementCommentUpvotes,
    incrementCommentDownvotes: incrementCommentDownvotes,
    decrementCommentDownvotes: decrementCommentDownvotes
}
