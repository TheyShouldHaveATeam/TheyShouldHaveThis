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
            comments: [],
            commentFeed: 'comment'
        };
    },

    componentWillMount: function() {
        var self = this;

        $.ajax({
            type: 'GET',
            url: '/posts/'+this.props.postId+'.json',
            success: function(post) {
                console.log(post);
                self.setState({
                    idea: post.idea,
                    desc: post.desc,
                    category: post.category,
                    createdOn: post.createdOn,
                    score: post.upvotes - post.downvotes
                });
            },
            error: function(error) {
                console.log('error getting post');
                console.log(error);
            },

            success: function(vote) {
                if(vote.typeOfVote === 'upvote') {
                    self.setState({
                        upvoted: true,
                        downvoted: false
                    });
                }
                else if(vote.typeOfVote === 'downvote') {
                    self.setState({
                        upvoted: false,
                        downvoted: true
                    });
                }
            },

            error: function(err) {
                console.log('error getting posts');
                console.log(error);
            }

    });

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

    createComment: function(comment) {
        var self = this;

        console.log(JSON.stringify(comment,null,4));
        $.ajax({
            type: 'POST',
            url: '/posts/'+this.props.postId+'/comments',
            data: {
                comment: comment.text,
                href: comment.href,
                type: comment.type
            },
            success: function(newComment) {
                console.log('created comment');
                console.log(JSON.stringify(newComment, null, 4));
                self.getPostComments();
            },
            error: function(error) {
                console.log('error creating comment');
                console.log(error);
            }
        });
    },

    toggleUpvote: function(e) {
        console.log("up!");
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
            url: '/posts/'+this.props.postId+'.json',
            data: {
                typeOfVote: 'upvote'
            },
            success: function(response) {
                console.log(JSON.stringify(response));
                console.log('upvote');
            },
            error: function(error) {
                console.log('error upvoting');
                console.log(error);
            }
        });
    },

    toggleDownvote: function() {
        console.log("down");
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
            url: '/posts/'+this.props.postId+'.json',
            data: {
                typeOfVote: 'downvote'
            },
            success: function(response) {
                console.log(JSON.stringify(response));
                console.log('downvote');
            },
            error: function(error) {
                console.log('error downvoting');
                console.log(error);
            }
        });
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
                        <div className='upvote'></div>
                        <div className='score'>{currentScore}</div>
                        <div className='downvote'></div>
                    </div>
                </div>

                <div className='desc-panel'>
                    <span className="make-me-black"><p>{this.state.desc}</p></span>
                    <br/>

                    <div className="desc-footer">
                        <div className='comment-icons'>
                            <span className="comment-count-single">3</span>
                            &nbsp;<div onClick={this.selectCommentType} className={commentClass}></div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className="comment-count-single">3</span>
                            &nbsp;<div onClick={this.selectTheyHaveType} className={theyHaveClass}></div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className="comment-count-single">3</span>
                            &nbsp;<div onClick={this.selectCanMakeType} className={canMakeClass}></div>
                        </div>
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
            console.log('comment');
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
                <label htmlFor='href'>Link</label>,
                <input type='text' name='href' value={this.state.href} onChange={this.handleHrefChange} />
            ];
        }
        return (
            <form className='comment-form' onSubmit={this.handleFormSubmit}>
                <h3>New Comment</h3>
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
                comments.push(<CommentListItem text={comment.text} href={comment.href} />);
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
        var href = [];
        if(this.props.href) {
            href = <a href={this.props.href}>Link</a>;
        }
        return (
            <div className='comment-list-item'>
                <p>{this.props.text}</p>
                {href}
            </div>
        );

    }
});

var postId = $("#current-post").html();
React.renderComponent(
    <SinglePost postId = {postId} />,
    document.getElementById('single-post')
);
