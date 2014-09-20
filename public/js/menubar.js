/** @jsx React.DOM */

var MenuBar = React.createClass({
    render: function() {
        return (
            <div className='menu-bar'>
                <UserSignupModal />
                <UserLoginModal />
            </div>
        );
    }
});

var UserSignupModal = React.createClass({
    getInitialState: function() {
        return {
            email: '',
            username: '',
            password: ''
        };
    },

    handleEmailChange: function() {
        this.setState({email: event.target.value});
    },

    handleUsernameChange: function() {
        this.setState({username: event.target.value});
    },

    handlePasswordChange: function() {
        this.setState({password: event.target.value});
    },

    handleSignup: function(e) {
        e.preventDefault();
        console.log('signup');

        // TODO check values before sending
        $.ajax({
            type: 'POST',
            url: '/users',
            data: {
                email: this.state.email,
                username: this.state.username,
                password: this.state.password
            },
            success: function(user) {
                console.log('created user');
                console.log(JSON.stringify(user, null, 4));
            },
            error: function(error) {
                console.log('error creating user');
                console.log(error);
            }
        });
    },

    render: function() {
        return (
            <form className='signup-form' onSubmit={this.handleSignup}>
                <label htmlFor='email'>Email</label>
                <input type='email' name='email' value={this.state.email} onChange={this.handleEmailChange} />
                <label htmlFor='username'>Username</label>
                <input type='text' name='username' value={this.state.username} onChange={this.handleUsernameChange} />
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' value={this.state.password} onChange={this.handlePasswordChange} />
                <input type='submit' value='Sign up!' />
            </form>
        );
    }
});

var UserLoginModal = React.createClass({
    getInitialState: function() {
        return {
            email: '',
            password: ''
        };
    },

    handleEmailChange: function() {
        this.setState({email: event.target.value});
    },

    handlePasswordChange: function() {
        this.setState({password: event.target.value});
    },

    handleLogin: function(e) {
        e.preventDefault();
        console.log('login');

        // TODO check values before sending
        $.ajax({
            type: 'POST',
            url: '/users/login',
            data: {
                email: this.state.email,
                password: this.state.password
            },
            success: function(user) {
                console.log('logged in as user');
                console.log(JSON.stringify(user, null, 4));
            },
            error: function(error) {
                console.log('error logging in as user');
                console.log(error);
            }
        });
    },

    render: function() {
        return (
            <form className='signup-form' onSubmit={this.handleLogin}>
                <label htmlFor='email'>Email</label>
                <input type='email' name='email' value={this.state.email} onChange={this.handleEmailChange} />
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' value={this.state.password} onChange={this.handlePasswordChange} />
                <input type='submit' value='Log in!' />
            </form>
        );
    }
});

React.renderComponent(
    <MenuBar />,
    document.getElementById('menubar')
);
