var dbUser = require(__dirname + '/user.js');
var dbPost = require(__dirname + '/post.js');
var dbComment = require(__dirname + '/comment.js');
var ObjectID = require('mongodb').ObjectID;

function voteOnPost(db, userId, postId, typeOfVote, callback) {
    db.collection('postVotes').findOne({ "postId": postId, "userId": userId }, function(err, result) {
        if(err) {
            callback({
                "success": false,
                "error": err,
                "errorType": "database"
            });
            return;
        }

        if(result) {
            if(result.typeOfVote === typeOfVote) {
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

                    //need to decrement the typeOfVote
                    if(typeOfVote === "upvote") {
                        dbPost.decrementPostUpvotes(db, postId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            dbUser.decrementPostUpvotes(db, result.userId, function(result) {
                                if(result.success === false) {
                                    callback(result);
                                    return;
                                }

                                callback({ "success": true });
                            });
                        });
                    } else if(typeOfVote === "downvote") {
                        dbPost.decrementPostDownvotes(db, postId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            dbUser.decrementPostDownvotes(db, result.userId, function(result) {
                                if(result.success === false) {
                                    callback(result);
                                    return;
                                }

                                callback({ "success": true });
                            });
                        });
                    } else {
                        console.log("MAJOR BUG in voteOnPost. Invalid typeOfVote");
                    }
                });
            } else {
                //update typeOfVote
                db.collection('postVotes').update({ "_id": result._id }, { "$set": { "typeOfVote": typeOfVote } }, function(err, removed) {
                    if(err) {
                        callback({
                            "success": false,
                            "error": err,
                            "errorType": "database"
                        });
                        return;
                    }

                    if(typeOfVote === "upvote") {
                        //need to increment upvote and decrement downvote
                        dbPost.decrementPostDownvotes(db, postId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            dbPost.incrementPostUpvotes(db, postId, function(result) {
                                if(result.success === false) {
                                    callback(result);
                                    return;
                                }

                                var userId = new ObjectID(result.userId);
                                dbUser.decrementPostDownvotes(db, userId, function(result) {
                                    if(result.success === false) {
                                        callback(result);
                                        return;
                                    }

                                    dbUser.incrementPostUpvotes(db, userId, function(result) {
                                        if(result.success === false) {
                                            callback(result);
                                            return;
                                        }

                                        removed.success = true;
                                        callback(removed);
                                    });
                                });
                            });
                        });
                    } else {
                        //need to decrement upvote and increment downvote
                        dbPost.decrementPostUpvotes(db, postId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            dbPost.incrementPostDownvotes(db, postId, function(result) {
                                if(result.success === false) {
                                    callback(result);
                                    return;
                                }

                                var userId = new ObjectID(result.userId);
                                dbUser.decrementPostUpvotes(db, userId, function(result) {
                                    if(result.success === false) {
                                        callback(result);
                                        return;
                                    }

                                    dbUser.incrementPostDownvotes(db, userId, function(result) {
                                        if(result.success === false) {
                                            callback(result);
                                            return;
                                        }

                                        removed.success = true;
                                        callback(removed);
                                    });
                                });
                            });
                        });
                    }
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
                var firstResult = result;

                //need to increment typeOfVote
                if(typeOfVote === "upvote") {
                    dbPost.incrementPostUpvotes(db, postId, function(result) {
                        if(result.success === false) {
                            callback(result);
                            return;
                        }

                        dbUser.incrementPostUpvotes(db, result.userId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            firstResult.success = true;
                            callback(firstResult);
                        });
                    });
                } else if(typeOfVote === "downvote") {
                    dbPost.incrementPostDownvotes(db, postId, function(result) {
                        if(result.success === false) {
                            callback(result);
                            return;
                        }

                        dbUser.incrementPostDownvotes(db, result.userId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            callback(firstResult);
                        });
                    });
                } else {
                    console.log("MAJOR BUG in voteOnPost. Invalid typeOfVote");
                }
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

                    //need to decrement the typeOfVote
                    if(typeOfVote === "upvote") {
                        dbComment.decrementCommentUpvotes(db, commentId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            dbUser.decrementCommentUpvotes(db, result.userId, function(result) {
                                if(result.success === false) {
                                    callback(result);
                                    return;
                                }

                                callback({ "success": true });
                            })
                        });
                    } else if(typeOfVote === "downvote") {
                        dbComment.decrementCommentDownvotes(db, commentId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            dbUser.decrementCommentDownvotes(db, result.userId, function(result) {
                                if(result.success === false) {
                                    callback(result);
                                    return;
                                }

                                callback({ "success": true });
                            })
                        });
                    } else {
                        console.log("MAJOR BUG in voteOnComment. Invalid typeOfVote");
                    }
                });
            } else {
                //update typeOfVote
                db.collection('commentVotes').update({ "_id": result._id }, { "$set": { "typeOfVote": typeOfVote } }, function(err, removed) {
                    if(err) {
                        callback({
                            "success": false,
                            "error": err,
                            "errorType": "database"
                        });
                        return;
                    }

                    if(typeOfVote === "upvote") {
                        //need to increment upvote and decrement downvote
                        dbComment.decrementCommentDownvotes(db, commentId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            dbComment.incrementCommentUpvotes(db, commentId, function(result) {
                                if(result.success === false) {
                                    callback(result);
                                    return;
                                }

                                var userId = new ObjectID(result.userId);
                                dbUser.decrementCommentDownvotes(db, userId, function(result) {
                                    if(result.success === false) {
                                        callback(result);
                                        return;
                                    }

                                    dbUser.incrementCommentUpvotes(db, userId, function(result) {
                                        if(result.success === false) {
                                            callback(result);
                                            return;
                                        }

                                        removed.success = true;
                                        callback(removed);
                                    });
                                });
                            });
                        });
                    } else {
                        //need to decrement upvote and increment downvote
                        dbComment.decrementCommentUpvotes(db, commentId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            dbComment.incrementCommentDownvotes(db, commentId, function(result) {
                                if(result.success === false) {
                                    callback(result);
                                    return;
                                }

                                var userId = new ObjectID(result.userId);
                                dbUser.decrementCommentUpvotes(db, userId, function(result) {
                                    if(result.success === false) {
                                        callback(result);
                                        return;
                                    }

                                    dbUser.incrementCommentDownvotes(db, userId, function(result) {
                                        if(result.success === false) {
                                            callback(result);
                                            return;
                                        }

                                        removed.success = true;
                                        callback(removed);
                                    });
                                });
                            });
                        });
                    }
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
                var firstResult = result;

                //need to increment typeOfVote
                if(typeOfVote === "upvote") {
                    dbComment.incrementCommentUpvotes(db, commentId, function(result) {
                        if(result.success === false) {
                            callback(result);
                            return;
                        }

                        dbUser.incrementCommentUpvotes(db, result.userId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            callback(firstResult);
                        });
                    });
                } else if(typeOfVote === "downvote") {
                    dbComment.incrementCommentDownvotes(db, commentId, function(result) {
                        if(result.success === false) {
                            callback(result);
                            return;
                        }

                        dbUser.incrementCommentDownvotes(db, result.userId, function(result) {
                            if(result.success === false) {
                                callback(result);
                                return;
                            }

                            callback(firstResult);
                        });
                    });
                } else {
                    console.log("MAJOR BUG in voteOnPost. Invalid typeOfVote");
                }
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

function getUserVoteOnPost(db, postId, userId, callback) {
    db.collection('postVotes').findOne({ "postId": postId, "userId": userId }, function(err, result) {
        if(err) {
            callback({
                success: false,
                error: err,
                errorType: 'database'
            });
            return;
        }
        if(!result) result = {};
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
    voteOnPost: voteOnPost,
    getUserVoteOnPost: getUserVoteOnPost
};
