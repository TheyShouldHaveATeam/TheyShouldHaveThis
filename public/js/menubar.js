/** @jsx React.DOM */

var MenuBar = React.createClass({
    componentWillMount: function() {
        var self = this;
        if(this.props.currentUserId) {
            $.ajax({
                type: 'GET',
                url: '/users/' + self.props.currentUserId + '.json',
                success: function(currentUser) {
                    self.setState({currentUser: currentUser});
                },
                error: function(error) {
                    console.log('error logging in');
                    console.log(error);
                }
            });
        }
    },

    getInitialState: function() {
        return {
            currentUser: null
        }
    },

    createUser: function(user) {
        var self = this;

        // TODO check values before sending
        console.log(JSON.stringify(user,null,4));
        $.ajax({
            type: 'POST',
            url: '/users',
            data: {
                email: user.email,
                username: user.username,
                password: user.password
            },
            success: function(newUser) {
                console.log('created user');
                console.log(JSON.stringify(newUser, null, 4));
                self.setState({currentUser: newUser});
                self.closeAuthModal();
            },
            error: function(error) {
                console.log('error creating user');
                console.log(error);
            }
        });
    },

    loginAsUser: function(user) {
        var self = this;
        console.log(JSON.stringify(user,null,4));
        // TODO check values before sending
        $.ajax({
            type: 'POST',
            url: '/users/login',
            data: {
                email: user.email,
                password: user.password
            },
            success: function(loggedInUser) {
                console.log('logged in as user');
                console.log(JSON.stringify(loggedInUser, null, 4));
                self.setState({currentUser: loggedInUser});
                self.closeAuthModal();
            },
            error: function(error) {
                console.log('error logging in as user');
                console.log(error);
            }
        });
    },

    logout: function() {
        var self = this;
        $.ajax({
            type: 'POST',
            url: '/users/logout',
            success: function(response) {
                console.log('successfully logged out');
                self.setState({currentUser: null});
            },
            error: function(error) {
                console.log('error logging out');
            }
        });
    },

    openAuthModal: function() {
        $('#auth-modal, #auth-modal-backdrop').show();
    },
    closeAuthModal: function() {
        $('#auth-modal, #auth-modal-backdrop').hide();
    },

    render: function() {
        var menuContent = [
            <button type='button' className='login-signup' onClick={this.openAuthModal}>Signup/Login</button>,
            <div id='auth-modal-backdrop' onClick={this.closeAuthModal}></div>,
            <div id='auth-modal'>
                <UserSignupModal key='signup' createUser={this.createUser} />
                <UserLoginModal key='login' loginAsUser={this.loginAsUser} />
            </div>
        ];
        console.log(this.state.currentUser);
        if(this.state.currentUser) {
            menuContent = [
                <h3>Logged in as {this.state.currentUser.email}</h3>,
                <button type='button' className='logout' onClick={this.logout}>Log out</button>
            ];
        }
        return (
            <div className='menu-bar'>
                { menuContent }
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

    handleFormSubmit: function(e) {
        e.preventDefault();
        console.log('signup');
        this.props.createUser({
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        });
    },

    render: function() {
        return (
            <form className='signup-form' onSubmit={this.handleFormSubmit}>
                <h3>Signup</h3>
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

    handleFormSubmit: function(e) {
        e.preventDefault();
        console.log('login');
        this.props.loginAsUser({
            email: this.state.email,
            password: this.state.password
        });
    },

    render: function() {
        return (
            <form className='login-form' onSubmit={this.handleFormSubmit}>
                <h3>Login</h3>
                <label htmlFor='email'>Email</label>
                <input type='email' name='email' value={this.state.email} onChange={this.handleEmailChange} />
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' value={this.state.password} onChange={this.handlePasswordChange} />
                <input type='submit' value='Log in!' />
            </form>
        );
    }
});

var currentUserId = $('#current-user').html();
React.renderComponent(
    <MenuBar loggedIn={false} currentUserId={currentUserId} />,
    document.getElementById('menubar')
);
