/** @jsx React.DOM */

var NewPost = React.createClass({

    getInitialState: function() {
        return {
            title: '',
            description: '',
            category: ''
        }
    },

    createPost: function(post) {
        var self = this;

        // TODO check values before sending
        console.log(JSON.stringify(post,null,4));
        $.ajax({
            type: 'POST',
            url: '/posts',
            data: {
                idea: post.title,
                desc: post.description,
                category: post.category
            },
            success: function(newPost) {
                console.log('created post');
                console.log(JSON.stringify(newPost, null, 4));
                self.closeNewPostModal();
                document.location = '/posts/' + newPost._id;
            },
            error: function(error) {
                console.log('error creating post');
                console.log(error);
            }
        });
    },

    openNewPostModal: function() {
        $('#new-post-modal, #new-post-modal-backdrop').show();
    },
    closeNewPostModal: function() {
        $('#new-post-modal, #new-post-modal-backdrop').hide();
    },

    handleTitleChange: function() {
        this.setState({title: event.target.value});
    },
    handleDescriptionChange: function() {
        this.setState({description: event.target.value});
    },
    handleCategoryChange: function() {
        this.setState({category: event.target.value});
    },

    handleInlineFormSubmit: function(e) {
        console.log(this.state.title);
        e.preventDefault();
        this.openNewPostModal();
    },

    handleFormSubmit: function(e) {
        e.preventDefault();
        console.log('new post');
        this.createPost({
            title: this.state.title,
            description: this.state.description,
            category: this.state.category
        });
    },

    render: function() {
        return(
            <div className='new-post'>
                <h1>TheyShouldHave&nbsp;
                    <form onSubmit={this.handleInlineFormSubmit}>
                        <input id='main-input' type='text' placeholder='This' value={this.state.title} onChange={this.handleTitleChange} />
                        <input type='submit' />
                    </form>
                </h1>
                <div id='new-post-modal-backdrop' onClick={this.closeNewPostModal}></div>
                <div id='new-post-modal'>
                    <form className='new-post-form' onSubmit={this.handleFormSubmit}>
                        <h3>New post</h3>
                        <label htmlFor='title'>Title</label>
                        <input type='text' name='title' value={this.state.title} onChange={this.handleTitleChange} />
                        <label htmlFor='description'>Description</label>
                        <textarea rows='4' onChange={this.handleDescriptionChange} placeholder='Description' value={this.state.description}></textarea>
                        <label htmlFor='category'>Category</label>
                        <input type='text' name='category' value={this.state.category} onChange={this.handleCategoryChange} />
                        <input type='submit' />
                    </form>
                </div>
            </div>
        );
    }
});

React.renderComponent(
    <NewPost />,
    document.getElementById('new-post')
);
