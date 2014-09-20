function getPost(db, postId, callback) {
    db.collection('posts').findOne({ "_id": postId }, function(err, post) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
            return;
        }

        post.success = true;
        callback(post);
    });
}

function createPost(db, userId, idea, desc, category, callback) {
    var post = {
        "userId": userId,
        "idea": idea,
        "desc": desc,
        "category": category,
        "createdOn": Date.now(),
        "votes": {
            "upvotes": 0,
            "downvotes": 0
        },
        "comments": {
            "theyHave": 0,
            "comment": 0,
            "canMake": 0
        }
    };

    db.collection('posts').insert(post, function(err, inserted) {
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

function deletePost(db, postId, callback) {
    db.collection('posts').remove({ "_id": postId }, function(err, removed) {
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
    })
}

function getPosts(db, callback) {
    db.collection('posts').find({}, function(result) {
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

modules.exports = {
    getPost: getPost,
    createPost: createPost,
    deletePost: deletePost,
    getPosts: getPosts
}
