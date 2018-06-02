module.exports = function (app, passport) {
    var filepath = 'C:\\Users\\Brendan\\Documents\\senior-project\\files\\';

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

    app.post('/createSection', isTeacher, function(req, res, next) {
        res.redirect('/teacher');
    });

    app.post('/addSection', function(req, res, next) {
        res.redirect('/student');
    });

    app.get('/student', isStudent, function (req, res, next) {
        res.render('student', { title: studentName });
    });

    app.get('/courses', function (req, res, next) {
        var courses = [{ name: 'Math 101', id: 1}, { name: 'Math 201', id: 2}, {name: 'Math 301', id: 3}];

        res.send(courses);
    });

    app.get('/sections/:course', function(req, res, next) {
        var sections = [{ number: 1, description: 'description', quarter: 'Spring', year: 2018, teacher: 'Mr. Teacher', id: 1}, {number: 2, description: 'description', quarter: 'Spring', year: 2019, teacher: 'Ms. Teacher', id: 2}];
        res.send(sections);
    });

    app.get('/topics/:section', function(req, res, next) {
        var topics = [{name: 'Topic 1', number: 1, id: 1, text: 'some text'}, {name: 'Topic 2', number: 2, id: 2, text: 'some text'}];

        res.send(topics);
    });

    app.get('/resources/:topic', function(req, res, next) {
        var resources = [{name: "name1", id: 1}, {name: "nam2", id: 2}];

        res.send(resources);
    });

    app.get('/student/:course-:section', isStudent, function (req, res, next) {
        tempCourseName = "Math " + req.params['course'];
        tempSectionNumber = req.params['section'];

        res.render('studentCourse', { title: studentName, courseName: tempCourseName, sectionNumber: tempSectionNumber,
            sectionId: req.params['section'] });
    });

    app.get('/teacher/:course-:section', isTeacher, function (req, res, next) {
        var tempCourseName = "Math " + req.params['course'];
        var tempSectionNumber = req.params['section'];

        res.render('teacherCourse', { title: teacherName, courseName: tempCourseName, sectionId: req.params['section'],
            sectionNumber: tempSectionNumber });
    });

    app.get('/student/resource/:resource', isStudent, function(req, res, next) {
        var resourceType = 'file';

        if (resourceType === 'video') {
            res.render('video', {
                title: studentName,
                courseName: req.params['course'] + "-" + req.params['section'],
                topicName: req.params['topic'],
                videoName: req.params['video']
            });
        }
        else if (resourceType === 'problem') {
            res.render('problem', {
                title: studentName,
                courseName: req.params['course'] + "-" + req.params['section'],
                topicName: req.params['topic'],
                problemName: req.params['problem']
            });
        }
        else {
            res.sendFile(filepath + 'Hotel ERD.pdf');
        }

    });

    app.get('/student/:course-:section/:topic/problem=:problem', isStudent, function (req, res, next) {
    });

    app.get('/student/:course-:section/:topic/video=:video', isStudent, function (req, res, next) {
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