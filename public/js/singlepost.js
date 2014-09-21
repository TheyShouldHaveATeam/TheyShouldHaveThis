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
                    score: post.upvotes - post.downvotes,
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
        return (
            <div>
            <a className='post-list-item' href={"/posts/"+this.props.postId+'.json'}>
                <h1>{this.state.idea}</h1>
            </a>
            <div className={votesClass}>
                <div className='upvote'></div>
                <div className='score'>{currentScore}</div>
                <div className='downvote'></div>
            </div>

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
