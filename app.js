var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var session = require('session');

app.set('views', '/views');
app.set('view engine', 'jade');

app.use(express.static("public"));
app.user(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(3000);

app.get('/', function(req, res) {
    res.render('index');
});
