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

        inserted.success = true;
        callback(inserted);
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
    var numberOfPosts = 25;

    db.collection('posts').find({ "$query": {}, "$orderby": { "createdOn" : -1 } }).limit(numberOfPosts).toArray(function(err, result) {
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

module.exports = {
    getPost: getPost,
    createPost: createPost,
    deletePost: deletePost,
    getPosts: getPosts
}
