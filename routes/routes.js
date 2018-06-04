module.exports = function (app, passport) {
    //Set filepath to load files from
    var filepath = 'C:\\Users\\Brendan\\Documents\\senior-project\\files\\';

    //Load requirements
    var multer = require('multer');
    var path = require('path');
    var dbFunctions = require('../lib/queries')

    //Set multer to save files to proper filepath
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './files');
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    let upload = multer({ storage: storage });

    //Website titles
    var teacherName = 'Teaching';
    var studentName = 'Learning';
    var websiteName = 'Website';

    /* GET home page. */
    app.get('/', function (req, res) {
        //If already logged in, send home
        if (req.user)
            res.redirect('/home');
        //send login
        res.render('login', { title: websiteName });
    });

    //send to / for proper routing
    app.get('/login', function (req, res, next) {
        res.redirect('/');
    });

    //Attempt to log in
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }), function (req, res) {
        //Add user to session
        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
            req.session.cookie.expires = false;
        }
        res.redirect('/');
    });

    //Send signup page
    app.get('/signup', function (req, res) {
        res.render('signup', { title: websiteName, message: req.flash('signupMessage') });
    });

    //Attempt to signup
    app.post('/signup', function (req, res, next) {
        //sign up here
        console.log("signing up " + req.body);
        dbFunctions.createUser(req.body.username, req.body.firstName, req.body.lastName, req.body.password, req.body.privilegeLevel, next)
    },
        //After creating user, authenticate
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

    //Render homepage for teacher/student
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

    //Create section in DB
    app.post('/createSection', isLoggedIn, function (req, res) {
        dbFunctions.createSection(req.user.email, req.body.quarter, parseInt(req.body.year), req.body.description, parseInt(req.body.courseId), req.body.passcode, function () {
            res.redirect('/home');
        })
    });

    //Delete course in DB
    app.get('/deleteCourse', isLoggedIn, function (req, res) {
        dbFunctions.deleteCourse(req.user.email, req.query.courseId, function () {
            res.redirect('/home');
        })
    });

    //Delete section in DB
    app.get('/deleteSection', isLoggedIn, function (req, res) {
        dbFunctions.deleteSection(req.user.email, parseInt(req.query.sectionId), function () {
            res.redirect('/home');
        });
    });

    //Create course in DB
    app.post('/createCourse', isLoggedIn, function (req, res) {
        dbFunctions.createCourse(req.body.courseName, req.user.email, function () {
            res.redirect('/home');
        });
    });

    //Toggle topic visibility in DB
    app.post("/hideTopic", isLoggedIn, function (req, res) {
        //Check whether we need to hide or show
        var visible = (req.body.method === "Show To Students");

        dbFunctions.hideTopic(req.user.email, parseInt(req.body.topicId), visible, function () {
            res.send({ visible: visible })
        })
    });

    //Toggle resource visibility in DB
    app.post("/hideResource", isLoggedIn, function (req, res) {
        //Check whether we need to hide or show
        var visible = (req.body.method === "Show To Students");

        dbFunctions.hideResource(req.user.email, parseInt(req.body.resourceId), visible, function () {
            res.send({ visible: visible })
        })
    });

    //Add section to DB
    app.post('/addSection', isLoggedIn, function (req, res) {
        dbFunctions.addSection(req.user.email, parseInt(req.body.sectionId), req.body.passcode, function () {
            res.redirect('/home');
        });
    });

    //Delete topic from DB
    app.get('/deleteTopic', isLoggedIn, function (req, res) {
        dbFunctions.deleteTopic(req.user.email, parseInt(req.query.topicId), function () {
            res.redirect('/section/' + req.query.sectionId);
        })
    });

    //Delete resource from DB
    app.get('/deleteResource', isLoggedIn, function (req, res) {
        dbFunctions.deleteResource(req.user.email, parseInt(req.query.resourceId), function () {
            res.redirect('/section/' + req.query.sectionId);
        })
    });

    //Add topic to DB
    app.post('/addTopic', isLoggedIn, function (req, res) {
        dbFunctions.createTopic(req.user.email, req.body.sectionId, req.body.topicName, req.body.topicDescription, function () {
            res.redirect('/section/' + parseInt(req.body.sectionId));
        })
    });

    //Add resource to DB
    app.post('/addResource', isLoggedIn, upload.single('fileLocation'), function (req, res) {
        //Resource location is stored in different fields depending on resource type
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

        dbFunctions.createResource(req.user.email, parseInt(req.body.topicId), req.body.resourceName, tempResourceType, tempResourceLocation, function () {
            res.redirect('/section/' + req.body.sectionId);
        })
    });

    //Get course list from DB
    app.get('/courses', isLoggedIn, function (req, res) {
        dbFunctions.getCourses(req.user.email, function (courses) {
            res.send(courses);
        });
    });

    //Get section list from DB given course
    app.get('/sections/:course', isLoggedIn, function (req, res) {
        dbFunctions.getSections(parseInt(req.params['course']), req.user.email, function (sections) {
            res.send(sections);
        });
    });

    //Get topic list form DB given section
    app.get('/topics/:section', isLoggedIn, function (req, res) {
        dbFunctions.getTopics(parseInt(req.params['section']), req.user.email, function (topics) {
            res.send(topics);
        });
    });

    //Get resource list from DB given topic
    app.get('/resources/:topic', isLoggedIn, function (req, res) {
        dbFunctions.getResources(parseInt(req.params['topic']), req.user.email, function (resources) {
            res.send(resources);
        });
    });

    //Get section page
    app.get('/section/:section', isLoggedIn, function (req, res) {
        //Get necessary info from db
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

    //Get resource page
    app.get('/resource/:resource', isLoggedIn, function (req, res) {
        //Get necessary info from DB
        dbFunctions.getResource(parseInt(req.params['resource']), req.user.email, function (data) {
            var tempCourseName = data[0].courseName + '-' + data[0].sectionId;
            var tempTopicName = data[0].topicName;
            var tempSectionId = data[0].sectionId;
            var tempResourceName = data[0].resourceName;
            var tempResourceLocation = data[0].resourceLocation;
            var tempResourceType = data[0].resourceType;

            //Send right page for resource
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

    //Log out and remove from session
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