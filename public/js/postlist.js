/** @jsx React.DOM */


var PostList = React.createClass( {

    getInitialState: function() {
        return {
            posts: [
                {id: "lshagdlk", title: "Ironman", score: 100},
                {id: "dlk", title: "Iron", score: 99},
                {id: "shag", title: "onman", score: 0},
                {id: "llk", title: "Ironmadsjn", score: 10}
            ]
        };
    },

    render: function() {
        var posts = [];
        this.state.posts.forEach(function(post) {
            console.log(post.title);
            posts.push(<SinglePost postId={post.id} title={post.title} score={post.score} />);
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
                <h1>{this.props.title}</h1>
            </a>
        );

    }
});

React.renderComponent(
    <PostList />,
    document.getElementById('post-list')
);
