/** @jsx React.DOM */


var PostList = React.createClass( {

    getInitialState: function() {
        return {
            posts: []
        };
    },

    componentWillMount: function() {
        var self = this;

        $.ajax({
            type: 'GET',
            url: '/posts',
            success: function(posts) {
                self.setState({posts: posts});
            },
            error: function(error) {
                console.log('error getting posts');
                console.log(error);
            }
        });
    },

    render: function() {
        var posts = [];
        var self = this;
        this.state.posts.forEach(function(post) {

            posts.push(<PostListItem
                postId={post._id}
                title={post.idea}
                score={post.upvotes-post.downvotes}
                userId={post.userId}
                desc={post.desc}
                category={post.category}
                commentCount={post.comment}
                theyHaveCount={post.theyHave}
                canMakeCount={post.canMake}
            />);

        });
        return (
            <div className = "postlist">
                {posts}
            </div>
        );
    }
});

var PostListItem = React.createClass({
    componentWillMount: function() {
        if(!this.props.userId) return;
        var self = this;

        $.ajax({
            type: 'GET',
            url: '/posts/'+this.props.postId+'/vote/'+this.props.userId,
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
            error: function(error) {
                console.log('error getting posts');
                console.log(error);
            }
        });

        $.ajax({
            type: 'GET',
            url: '/users/'+this.props.userId+'.json',
            success: function(user) {
                self.setState({username:user.username});
            },
            error: function(error) {
                console.log('error getting username');
                console.log(error);
            }
        });
    },

    getInitialState: function() {
        return {
            upvoted: false,
            downvoted: false
        };
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
        var currentScore = this.props.score;
        var votesClass = 'votes';
        if(this.state.upvoted) {
            votesClass += ' upvoted';
            currentScore++;
        }
        else if(this.state.downvoted) {
            votesClass += ' downvoted';
            currentScore--;
        }
        return (
            <div className='post-list-item' href={"/posts/"+this.props.postId}>
                <div className={votesClass}>
                    <div className='upvote' onClick={this.toggleUpvote}></div>
                    <div className='score'>{currentScore}</div>
                    <div className='downvote' onClick={this.toggleDownvote}></div>
                </div>
                <div className="idea-wrapper">
                    <div className="invisible-spacer"></div>
                    <div className="display-inline-block idea-wrapper-wrapper">
                        <a href={"/posts/"+this.props.postId}>
                            <h2>{this.props.title}</h2>
                            <span className="idea-desc">{this.props.desc}</span>
                            <div className="username-wrapper">{this.state.username}</div>
                            <div className="icons-wrapper">
                                <span className="comment-count">{this.props.commentCount}</span>
                                &nbsp;<img className="little-icon comm" src="/images/comment_colored.png"/>
                                &nbsp;&nbsp;&nbsp;
                                <span className="comment-count">{this.props.theyHaveCount}</span>
                                &nbsp;<img className="little-icon check" src="/images/checkmark_colored.png"/>
                                &nbsp;&nbsp;&nbsp;
                                <span className="comment-count">{this.props.canMakeCount}</span>
                                &nbsp;<img className="little-icon excla" src="/images/exclamation_colored.png"/>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        );

    }
});

React.renderComponent(
    <PostList userId={currentUserId} />,
    document.getElementById('post-list')
);
