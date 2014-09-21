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
        "upvotes": 0,
        "downvotes": 0,
        "theyHave": 0,
        "comment": 0,
        "canMake": 0
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

        var insertedPost = inserted[0];
        insertedPost.success = true;
        callback(insertedPost);
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

        callback({ "success": true });
    })
}

function getPosts(db, pageNumber, callback) {
    var postsPerPage = 25;

    db.collection('posts').find({ "$query": {}, "$orderby": { "createdOn" : -1 } }).skip(pageNumber * postsPerPage).limit(postsPerPage).toArray(function(err, result) {
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

function getCategoryPosts(db, category, pageNumber, callback) {
    var postsPerPage = 25;

    db.collection('posts').find({ "$query": { "category": category }, "$orderby": { "createdOn" : -1 } }).skip(pageNumber * postsPerPage).limit(postsPerPage).toArray(function(err, result) {
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

function getUserPosts(db, userId, pageNumber, callback) {
    var postsPerPage = 25;

    db.collection('posts').find({ "$query": { "userId": userId }, "$orderby": { "createdOn" : -1 } }).skip(pageNumber * postsPerPage).limit(postsPerPage).toArray(function(err, result) {
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

function incrementPostUpvotes(db, postId, callback) {
    db.collection('posts').update({ "_id": postId }, { "$inc": { "upvotes": 1 } }, function(err, result) {
        if(err) {
            console.log('ERROR');
            console.log(err);
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

function decrementPostUpvotes(db, postId, callback) {
    db.collection('posts').update({ "_id": postId }, { "$inc": { "upvotes": -1 } }, function(err, result) {
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

function incrementPostDownvotes(db, postId, callback) {
    db.collection('posts').update({ "_id": postId }, { "$inc": { "downvotes": 1 } }, function(err, result) {
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

function decrementPostDownvotes(db, postId, callback) {
    db.collection('posts').update({ "_id": postId }, { "$inc": { "downvotes": -1 } }, function(err, result) {
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
    getPost: getPost,
    createPost: createPost,
    deletePost: deletePost,
    getPosts: getPosts,
    getCategoryPosts: getCategoryPosts,
    getUserPosts: getUserPosts,
    incrementPostUpvotes: incrementPostUpvotes,
    decrementPostUpvotes: decrementPostUpvotes,
    incrementPostDownvotes: incrementPostDownvotes,
    decrementPostDownvotes: decrementPostDownvotes
}
