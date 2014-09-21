/** @jsx React.DOM */

var SinglePost = React.createClass( {
    getInitialState: function() {
        return {
            idea: '',
            desc: '',
            category: '',
            createdOn: 0,
            upvotes:0,
            downvotes:0,
            commentFeed: 'comment',
            comments: [],
            upvoted: false,
            downvoted: false,
            commentCount: 0,
            theyHaveCount: 0,
            canMakeCount: 0

        };
    },

    componentWillMount: function() {
        this.updatePostData();
        this.getPostComments();
    },

    selectCommentType: function() {
        this.setState({commentFeed: 'comment'});
    },
    selectTheyHaveType: function() {
        this.setState({commentFeed: 'theyHave'});
    },
    selectCanMakeType: function() {
        this.setState({commentFeed: 'canMake'});
    },

    getPostComments: function() {
        var self = this;
        $.ajax({
            type: 'GET',
            url: '/posts/'+this.props.postId+'/comments',
            success: function(comments) {
                self.setState({comments: comments});
            },
            error: function(error) {
                console.log('error getting comments');
                console.log(error);
            }
        });
    },

    updatePostData: function() {
        var self = this;

        $.ajax({
            type: 'GET',
            url: '/posts/'+this.props.postId+'.json',
            success: function(post) {
                self.setState({
                    idea: post.idea,
                    desc: post.desc,
                    category: post.category,
                    createdOn: post.createdOn,
                    score: post.upvotes - post.downvotes,
                    commentCount: post.comment,
                    theyHaveCount: post.theyHave,
                    canMakeCount: post.canMake
                });

                $.ajax({
                    type: 'GET',
                    url: '/users/'+post.userId+'.json',
                    success: function(user) {
                        self.setState({username:user.username});
                    },
                    error: function(error) {
                        console.log('error getting username');
                        console.log(error);
                    }
                });
            },
            error: function(error) {
                console.log('error getting post');
                console.log(error);
            }
        });
    },

    createComment: function(comment) {
        var self = this;

        $.ajax({
            type: 'POST',
            url: '/posts/'+this.props.postId+'/comments',
            data: {
                comment: comment.text,
                href: comment.href.replace("http://" , ""),
                type: comment.type
            },
            success: function(newComment) {
                self.getPostComments();
                self.updatePostData();
            },
            error: function(error) {
                console.log('error creating comment');
                console.log(error);
            }
        });
    },

    toggleUpvote: function(e) {
        if(!loggedIn) {
            authenticate();
        }
        else {
            if(!this.state.upvoted) {
                this.setState({
                    upvoted: true,
                    downvoted: false
                });
            }
            else {
                this.setState({
                    upvoted: false,
                    downvoted: false
                });
            }
            $.ajax({
                type: 'POST',
                url: '/posts/'+this.props.postId+'/vote',
                data: {
                    typeOfVote: 'upvote'
                },
                success: function(response) {
                },
                error: function(error) {
                    console.log('error upvoting');
                    console.log(error);
                }
            });
        }
    },

    toggleDownvote: function() {
        if(!loggedIn) {
            authenticate();
        }
        else {
            if(!this.state.downvoted) {
                this.setState({
                    upvoted: false,
                    downvoted: true
                });
            }
            else {
                this.setState({
                    upvoted: false,
                    downvoted: false
                });
            }
            $.ajax({
                type: 'POST',
                url: '/posts/'+this.props.postId+'/vote',
                data: {
                    typeOfVote: 'downvote'
                },
                success: function(response) {
                },
                error: function(error) {
                    console.log('error downvoting');
                    console.log(error);
                }
            });
        }
    },

    render: function() {
        var currentScore = this.state.score;
        var votesClass = 'votes';
        if(this.state.upvoted) {
            votesClass += ' upvoted';
            currentScore++;
        }
        else if(this.state.downvoted) {
            votesClass += ' downvoted';
            currentScore--;
        }


        var commentClass = 'comments';
        var theyHaveClass = 'they-have';
        var canMakeClass = 'can-make';
        if(this.state.commentFeed==='comment') {
            commentClass += ' selected';
        }
        else if(this.state.commentFeed==='theyHave') {
            theyHaveClass += ' selected';
        }
        else if(this.state.commentFeed==='canMake') {
            canMakeClass += ' selected';
        }
        return (
            <div>
                <div className='post-list-item single-post make-me-white'>
                    <h1><div className="give-me-padding">{this.state.idea}</div></h1>

                    <div className={votesClass}>
                        <div className='upvote' onClick = {this.toggleUpvote}></div>
                        <div className='score'>{currentScore}</div>
                        <div className='downvote' onClick = {this.toggleDownvote}></div>
                    </div>
                </div>

                <div className='desc-panel'>
                    <span className="make-me-black"><p>{this.state.desc}</p></span>

                    <div className="desc-footer">
                        <div className="username-wrapper-single">{this.state.username}</div>
                        <div className='comment-icons'>
                            <span className="comment-count-single">{this.state.commentCount}</span>
                            &nbsp;<div onClick={this.selectCommentType} className={commentClass}></div>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span className="comment-count-single">{this.state.theyHaveCount}</span>
                            &nbsp;<div onClick={this.selectTheyHaveType} className={theyHaveClass}></div>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span className="comment-count-single">{this.state.canMakeCount}</span>
                            &nbsp;<div onClick={this.selectCanMakeType} className={canMakeClass}></div>
                        </div>
                        <div className="category-wrapper-single">{this.state.category}</div>
                    </div>
                </div>

                <CommentList type={this.state.commentFeed} comments={this.state.comments} createComment={this.createComment} />
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState: function() {
        return {
            text: '',
            href: '',
            type: ''
        };
    },

    handleTextChange: function() {
        this.setState({text: event.target.value});
    },

    handleHrefChange: function() {
        this.setState({href: event.target.value});
    },

    handleFormSubmit: function(e) {
        e.preventDefault();
        if(!loggedIn) {
            authenticate();
        }
        else {
            this.props.createComment({
                text: this.state.text,
                href: this.state.href,
                type: this.props.type
            });
        }
    },

    render: function() {
        var href = [];
        if(this.props.type !== 'comment') {
            href = [
                <label htmlFor='href'>Attached Link</label>,
                <input type='text' name='href' value={this.state.href} onChange={this.handleHrefChange} />
            ];
        }

        var commentHeader = 'Comment';
        if(this.props.type === 'theyHave') {
            commentHeader = '"They have this!"';
        }
        else if(this.props.type === 'canMake') {
            commentHeader = '"I can make this!"';
        }
        return (
            <form className='comment-form' onSubmit={this.handleFormSubmit}>
                <h3>{commentHeader}</h3>
                <label htmlFor='text'>Body</label>
                <textarea name='text' value={this.state.text} onChange={this.handleTextChange} rows='4'></textarea>
                {href}
                <input id="login-submit-button" type='submit' value='Post' />
            </form>
        );
    }
});

var CommentList = React.createClass( {

    render: function() {
        var comments = [];
        var self = this;
        this.props.comments.forEach(function(comment) {
            if(comment.type === self.props.type) {

                comments.push(<CommentListItem
                    text={comment.text}
                    href={comment.href}
                    type={comment.type} />);
            }
        });
        return (
            <div className = "commentlist">
                <CommentForm type={this.props.type} createComment={this.props.createComment} />
                {comments}
            </div>
        );
    }
});

var CommentListItem = React.createClass({

    render: function() {

        if(this.props.href) {
            var href = 'http://'+this.props.href;
            hrefTwo =
                <div className="link-wrapper-comment">
                    <a href={href}>Attached Link</a>
                </div>
                ;
        }
        commentClasses = "comment-list-item " + this.props.type;
        return (
            <div className={commentClasses}>
                <div className="comment-entire">
                    <div className="comment-text">
                        {this.props.text}
                    </div>

                    <div className="comment-footer">
                        <div className="username-wrapper-comment">
                            raphael
                        </div>
                        {hrefTwo}
                    </div>
                </div>
            </div>
        );

    }
});

var postId = $("#current-post").html();
React.renderComponent(
    <SinglePost postId = {postId} />,
    document.getElementById('single-post')
);
