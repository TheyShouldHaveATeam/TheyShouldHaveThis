var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var session = require('express-session');
var stylus = require('stylus');

var dbUser = require(__dirname + '/db/user.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(stylus.middleware({src: __dirname + '/public/styles/'}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(3000);

MongoClient.connect((process.env.MONGODB_CONNECT
        || "mongodb://localhost:27017/TSHT"), function(err, db) {
    if(err) {
        throw err;
    }

    app.get('/', function(req, res) {

        // dbUser.createUser(db, "Rapha", "rapha@email.com", "myPassword", function(user) {
        //     console.log(user);
        // });

        res.render('landing');
    });
});
