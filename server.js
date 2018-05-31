var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var port = process.env.PORT || 8080;
var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

require('./lib/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(session( {
    secret: 'MYSECRET',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());

app.use(express.static(__dirname + '/public'));

require('./routes/routes.js')(app, passport);

app.listen(port);
console.log('Listening on port ' + port);