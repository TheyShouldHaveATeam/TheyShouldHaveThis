var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var jwt = require('express-jwt');


app.set('views', '/views');
app.set('view engine', 'jade');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(3000);

app.get('/protected',
  jwt({secret: 'shhhhhhared-secret'}),
  function(req, res) {
    if (!req.user.admin) return res.send(401);
    res.send(200);
  });


app.get('/', function(req, res) {
    res.render('index');
});
