//Load requirements
var LocalStrategy   = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');

//Connect to DB
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

//Functions for Passport to use
module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM Users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // Strategy for logging in using local DB authentication
    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            //Get user with matching email from DB
            connection.query("SELECT * FROM Users WHERE email = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                //No user found
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].passwd))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};