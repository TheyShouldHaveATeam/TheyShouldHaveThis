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
            posts.push(<SinglePost postId={post._id} title={post.idea} score={post.votes.upvotes-post.votes.downvotes} />);
        });
        return (
            <div className = "postlist">
                {posts}
            </div>
        );
    }
});

var SinglePost = React.createClass( {

    render: function() {
        console.log(JSON.stringify(this.props));
        return (
            <a href={"/posts/"+this.props.postId}>
                <div class='votes'>
                    <div class='upvote'></div>
                    <div class='score'></div>
                    <div class='downvote'></div>
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
