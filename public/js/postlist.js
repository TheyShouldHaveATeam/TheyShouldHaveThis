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
        this.state.posts.forEach(function(post) {
            posts.push(<PostListItem postId={post._id} title={post.idea} score={post.votes.upvotes-post.votes.downvotes} />);
        });
        return (
            <div className = "postlist">
                {posts}
            </div>
        );
    }
});

var PostListItem = React.createClass({
    getInitialState: function() {
        return {
            upvoted: false,
            downvoted: false
        };
    },

    render: function() {
        console.log(JSON.stringify(this.props));
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
            <a className='post-list-item' href={"/posts/"+this.props.postId}>
                <div className={votesClass}>
                    <div className='upvote'></div>
                    <div className='score'>{currentScore}</div>
                    <div className='downvote'></div>
                </div>
                <h2>{this.props.title}</h2>
            </a>
        );

    }
});

React.renderComponent(
    <PostList />,
    document.getElementById('post-list')
);
