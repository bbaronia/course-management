module.exports = function (app, passport) {
    var teacherName = 'Teaching';
    var studentName = 'Learning';
    var websiteName = 'Website';

    var mysql = require('mysql');
    var dbconfig = require('../lib/database');
    var connection = mysql.createConnection(dbconfig.connection);

    connection.query('USE ' + dbconfig.database);

    /* GET home page. */
    app.get('/', function (req, res, next) {
        if (req.user && req.user.privilegeLevel === 'student')
            res.redirect('/student');
        if (req.user && req.user.privilegeLevel === 'teacher')
            res.redirect('/teacher');
        res.render('index', { title: websiteName });
    });

    app.get('/login', function (req, res, next) {
        res.redirect('/');
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/loggedin',
        failureRedirect: '/',
        failureFlash: true
    }), function (req, res) {

        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
            req.session.cookie.expires = false;
        }
        res.redirect('/');
    });

    app.get('/signup', function (req, res) {
        res.render('signup', { title: websiteName, message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/student',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/loggedin', function (req, res) {
        console.log(req.user);
        if (req.user.privilegeLevel === 'teacher')
            res.redirect('/teacher');
        else if (req.user.privilegeLevel === 'student')
            res.redirect('/student');
        else
            res.redirect('/login');
    });

    app.get('/teacher', isTeacher, function (req, res, next) {
        res.render('teacher', { title: teacherName });
    });

    app.get('/student', isStudent, function (req, res, next) {
        res.render('student', { title: studentName });
    });

    app.get('/student/:course-:section', isStudent, function (req, res, next) {
        res.render('studentCourse', { title: studentName, courseName: (req.params['course'] + "-" + req.params['section']) });
    });

    app.get('/teacher/:course-:section', isTeacher, function (req, res, next) {
        res.render('teacherCourse', { title: teacherName, courseName: req.params['course'] + "-" + req.params['section'] });
    });

    app.get('/student/:course-:section/:topic/problem=:problem', isStudent, function (req, res, next) {
        res.render('problem', { title: studentName, courseName: req.params['course'] + "-" + req.params['section'], topicName: req.params['topic'], problemName: req.params['problem'] });
    });

    app.get('/student/:course-:section/:topic/video=:video', isStudent, function (req, res, next) {
        res.render('video', {
            title: studentName,
            courseName: req.params['course'] + "-" + req.params['section'],
            topicName: req.params['topic'],
            videoName: req.params['video']
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

function isTeacher(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.user && req.user.privilegeLevel === 'teacher')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isStudent(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.user && req.user.privilegeLevel === 'student')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}