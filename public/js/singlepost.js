/** @jsx React.DOM */

var SinglePost = React.createClass( {

    getInitialState: function() {
        return {
            post:
        };
    },

    componentWillMount: function() {
        var self = this;

        $.ajax({
            type: 'GET',
            url: '/posts/'+this.props.postId,
            success: function(post) {
                console.log(post);
                self.setState({post: post});
            },
            error: function(error) {
                console.log('error getting post');
                console.log(error);
            }
        });
    },

    render: function() {
        console.log(JSON.stringify(this.state);
        return (
            <h1>test</h1>

        );

    }
});

var postId = $("#current-post").html();

React.renderComponent(
    <SinglePost postId = {postId} />,
    document.getElementById('single-post')
);
