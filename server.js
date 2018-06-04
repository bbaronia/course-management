//Load requirements
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();

//Set port to 8080
var port = process.env.PORT || 8080;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

require('./lib/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Server logging
app.use(logger('dev'));

//Set up passport
app.use(session( {
    secret: 'MYSECRET',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());

//Set up public resources
app.use(express.static(__dirname + '/public'));

//use routes.js for routing
require('./routes/routes.js')(app, passport);

//listen
app.listen(port);
console.log('Listening on port ' + port);