/** @jsx React.DOM */

var MenuBar = React.createClass({
    componentWillMount: function() {
        authenticate = this.openAuthModal;

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
        $.ajax({
            type: 'POST',
            url: '/users',
            data: {
                email: user.email,
                username: user.username,
                password: user.password
            },
            success: function(newUser) {
                self.setState({currentUser: newUser});
                self.closeAuthModal();
            },
            error: function(error) {
                console.log('error creating user');
                console.log(error);
                var errorMessage = JSON.parse(error.responseText).error;
                self.setState({signupError: errorMessage});
            }
        });
    },

    loginAsUser: function(user) {
        var self = this;
        // TODO check values before sending
        $.ajax({
            type: 'POST',
            url: '/users/login',
            data: {
                email: user.email,
                password: user.password
            },
            success: function(loggedInUser) {
                loggedIn = true;
                self.setState({currentUser: loggedInUser});
                self.closeAuthModal();
            },
            error: function(error) {
                console.log('error logging in as user');
                console.log(error);
                var errorMessage = JSON.parse(error.responseText).error;
                self.setState({loginError: errorMessage});
            }
        });
    },

    logout: function() {
        var self = this;
        $.ajax({
            type: 'POST',
            url: '/users/logout',
            success: function(response) {
                self.setState({currentUser: null});
                loggedIn = false;
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
            <div id='login-wrapper'>
                <div id="log-elements-wrapper">
                    <div id="elements-wrapper">
                        <span id="align-center">
                            <button type='button' className='login-signup' onClick={this.openAuthModal}>Login/Register</button>
                            <div id='auth-modal-backdrop' onClick={this.closeAuthModal}></div>
                            <div id='auth-modal'>
                                <div id='logo-auth-modal'>
                                    <img id='logo-auth-modal-img' src="/images/loading.gif" />
                                    <h5 id="auth-desc">TheyShouldHaveThis is all about connecting those who have ideas with those who have the skills to make these ideas become reality.<br/>Post an idea, find out if 'They Have This' already, or if someone is interested in creating it.</h5>
                                </div>
                                <UserSignupModal key='signup' createUser={this.createUser} error={this.state.signupError} />
                                <UserLoginModal key='login' loginAsUser={this.loginAsUser} error={this.state.loginError} />
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        ];
        if(this.state.currentUser) {
            loggedIn = true;
            menuContent = [
                <div id='loggedin-wrapper'>
                    <div id="log-elements-wrapper">
                        <div id="elements-wrapper">
                            <span id="align-center">
                                <span id="logged-in-as">Logged in as {this.state.currentUser.email}</span>&nbsp;
                                <button type='button' className='logout' onClick={this.logout}>Log out</button>
                            </span>
                        </div>
                    </div>
                </div>
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
        this.props.createUser({
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        });
    },

    render: function() {
        return (
            <form className='signup-form' onSubmit={this.handleFormSubmit}>
                <h3>Sign Up</h3>
                <p className='error'>{this.props.error}</p>
                <label htmlFor='email'>Email</label>
                <input type='email' name='email' value={this.state.email} onChange={this.handleEmailChange} />
                <label htmlFor='username'>Username</label>
                <input tynodepe='text' name='username' value={this.state.username} onChange={this.handleUsernameChange} />
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' value={this.state.password} onChange={this.handlePasswordChange} />
                <input id="signup-submit-button" type='submit' value='Sign Up!' />
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
        this.props.loginAsUser({
            email: this.state.email,
            password: this.state.password
        });
    },

    render: function() {
        return (
            <form className='login-form' onSubmit={this.handleFormSubmit}>
                <h3>Login</h3>
                <p className='error'>{this.props.error}</p>
                <label htmlFor='email'>Email</label>
                <input type='email' name='email' value={this.state.email} onChange={this.handleEmailChange} />
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' value={this.state.password} onChange={this.handlePasswordChange} />
                <input id="login-submit-button" type='submit' value='Log in!' />
            </form>
        );
    }
});

React.renderComponent(
    <MenuBar loggedIn={false} currentUserId={currentUserId} />,
    document.getElementById('menubar')
);
