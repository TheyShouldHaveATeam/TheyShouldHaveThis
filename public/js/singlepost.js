/** @jsx React.DOM */

var SinglePost = React.createClass( {
    getInitialState: function() {
        return {
            idea: '',
            desc: '',
            category: '',
            createdOn: 0,
            votes: {upvotes:0, downvotes:0},
            comments: {theyHave:0, canMake:0, comment:0}
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
                    votes: post.votes,
                    comments: post.comments
                });
            },
            error: function(error) {
                console.log('error getting post');
                console.log(error);
            }
        });
    },

    render: function() {
        return (
            <div className='single-post'>
                <h1>{this.state.idea}</h1>
                <p>{this.state.desc}</p>
            </div>
        );

    }
});

var postId = $("#current-post").html();
React.renderComponent(
    <SinglePost postId = {postId} />,
    document.getElementById('single-post')
);
