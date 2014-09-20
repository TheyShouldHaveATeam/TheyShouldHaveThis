/** @jsx React.DOM */
var MenuBar = React.createClass({
    render: function() {
        return (
            <div className='menu-bar'>
                I am a menu bar
            </div>
        );
    }
});

var LoginSignupModal = React.createClass({
    render: function() {
        
    }
});

React.renderComponent(
    <MenuBar />,
    document.getElementById('menubar')
);
