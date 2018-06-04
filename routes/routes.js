module.exports = function (app, passport) {
    var filepath = 'C:\\Users\\Brendan\\Documents\\senior-project\\files\\';
    var multer = require('multer');
    var path = require('path');
    var dbFunctions = require('../lib/queries')

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './files');
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    let upload = multer({ storage: storage });

    var teacherName = 'Teaching';
    var studentName = 'Learning';
    var websiteName = 'Website';

    var mysql = require('mysql');

    /* GET home page. */
    app.get('/', function (req, res) {
        if (req.user)
            res.redirect('/home');
        res.render('index', { title: websiteName });
    });

    app.get('/login', function (req, res, next) {
        res.redirect('/');
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home',
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

    app.post('/signup', function (req, res, next) {
        //sign up here
        console.log("signing up " + req.body);
        dbFunctions.createUser(req.body.username, req.body.firstName, req.body.lastName, req.body.password, req.body.privilegeLevel, next)
    },
        passport.authenticate('local-login', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }), function (req, res) {

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });

    app.get('/home', isLoggedIn, function (req, res) {
        if (req.user.privilegeLevel === "teacher") {
            res.render('teacher', {
                title: teacherName
            });
        }
        else if (req.user.privilegeLevel === "student") {
            res.render('student', {
                title: studentName
            });
        }
    });

    app.post('/createSection', isLoggedIn, function (req, res) {
        dbFunctions.createSection(req.user.email, req.body.quarter, parseInt(req.body.year), req.body.description, parseInt(req.body.courseId), req.body.passcode, function () {
            res.redirect('/home');
        })
    });

    app.get('/deleteCourse', isLoggedIn, function (req, res) {
        dbFunctions.deleteCourse(req.user.email, req.query.courseId, function () {
            res.redirect('/home');
        })
    });

    app.get('/deleteSection', isLoggedIn, function (req, res) {
        dbFunctions.deleteSection(req.user.email, parseInt(req.query.sectionId), function () {
            res.redirect('/home');
        });
    });

    app.post('/createCourse', isLoggedIn, function (req, res) {
        dbFunctions.createCourse(req.body.courseName, req.user.email, function () {
            res.redirect('/home');
        });
    });

    app.post("/hideTopic", isLoggedIn, function (req, res) {
        var visible = (req.body.method === "Show To Students");
        console.log(visible);
        dbFunctions.hideTopic(req.user.email, parseInt(req.body.topicId), visible, function() {
            res.send({ visible: visible })
        })
    });

    app.post("/hideResource", isLoggedIn, function (req, res) {
        var visible = (req.body.method === "Show To Students");
        console.log(visible);
        dbFunctions.hideResource(req.user.email, parseInt(req.body.resourceId), visible, function() {
            res.send({ visible: visible })
        })
    });

    app.post('/addSection', isLoggedIn, function (req, res) {
        dbFunctions.addSection(req.user.email, parseInt(req.body.sectionId), req.body.passcode, function() {
            res.redirect('/home');
        });
    });

    app.get('/deleteTopic', isLoggedIn, function (req, res) {
        dbFunctions.deleteTopic(req.user.email, parseInt(req.query.topicId), function () {
            res.redirect('/section/' + req.query.sectionId);
        })
    });

    app.get('/deleteResource', isLoggedIn, function (req, res) {
        dbFunctions.deleteResource(req.user.email, parseInt(req.query.resourceId), function() {
            res.redirect('/section/' + req.query.sectionId);
        })
    });

    app.post('/addTopic', isLoggedIn, function (req, res) {
        dbFunctions.createTopic(req.user.email, req.body.sectionId, req.body.topicName, req.body.topicDescription, function() {
            res.redirect('/section/' + parseInt(req.body.sectionId));
        })
    });

    app.post('/addResource', isLoggedIn, upload.single('fileLocation'), function (req, res) {
        var tempResourceType = req.body.resourceType;
        var tempResourceLocation = "";
        if (tempResourceType === "video") {
            tempResourceLocation = req.body.videoLocation;
        }
        else if (tempResourceType === "file") {
            tempResourceLocation = req.file.filename;
        }
        else {
            tempResourceLocation = req.body.problemLocation;
        }

        dbFunctions.createResource(req.user.email, parseInt(req.body.topicId), req.body.resourceName, tempResourceType, tempResourceLocation, function() {
            res.redirect('/section/' + req.body.sectionId);
        })
    });

    app.get('/courses', isLoggedIn, function (req, res) {
        dbFunctions.getCourses(req.user.email, function (courses) {
            res.send(courses);
        });
    });

    app.get('/sections/:course', isLoggedIn, function (req, res) {
        dbFunctions.getSections(parseInt(req.params['course']), req.user.email, function (sections) {
            res.send(sections);
        });
    });

    app.get('/topics/:section', isLoggedIn, function (req, res) {
        dbFunctions.getTopics(parseInt(req.params['section']), req.user.email, function (topics) {
            res.send(topics);
        });
    });

    app.get('/resources/:topic', isLoggedIn, function (req, res) {
        dbFunctions.getResources(parseInt(req.params['topic']), req.user.email, function (resources) {
            res.send(resources);
        });
    });

    app.get('/section/:section',isLoggedIn, function (req, res) {
            dbFunctions.getSection(parseInt(req.params['section']), req.user.email, function (courses) {
                var tempCourseName = courses[0].courseName;
                if (req.user.privilegeLevel === 'student') {
                    res.render('studentCourse', {
                        title: studentName, courseName: tempCourseName,
                        sectionId: req.params['section']
                    });
                }
                else if (req.user.privilegeLevel === 'teacher') {
                    res.render('teacherCourse', {
                        title: teacherName,
                        courseName: tempCourseName,
                        sectionId: req.params['section']
                    });
                }
            });
    });

    app.get('/resource/:resource', isLoggedIn, function (req, res) {
            dbFunctions.getResource(parseInt(req.params['resource']), req.user.email, function (data) {
                var tempCourseName = data[0].courseName + '-' + data[0].sectionId;
                var tempTopicName = data[0].topicName;
                var tempSectionId = data[0].sectionId;
                var tempResourceName = data[0].resourceName;
                var tempResourceLocation = data[0].resourceLocation;
                var tempResourceType = data[0].resourceType;


                if (tempResourceType === 'video') {
                    res.render('video', {
                        title: studentName,
                        courseName: tempCourseName,
                        topicName: tempTopicName,
                        sectionId: tempSectionId,
                        videoName: tempResourceName,
                        videoAddress: tempResourceLocation
                    });
                }
                else if (tempResourceType === 'problem') {
                    res.render('problem', {
                        title: studentName,
                        courseName: tempCourseName,
                        topicName: tempTopicName,
                        sectionId: tempSectionId,
                        problemName: tempResourceName,
                        problemJs: tempResourceLocation
                    });
                }
                else {
                    res.sendFile(filepath + tempResourceLocation);
                }

            });
    });

    app.get('/logout', isLoggedIn, function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

//Middleware to make sure user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.user)
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}