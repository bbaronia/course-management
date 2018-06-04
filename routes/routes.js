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
    //var dbconfig = require('../lib/database');
    //var connection = mysql.createConnection(dbconfig.connection);

    //connection.query('USE ' + dbconfig.database);

    /* GET home page. */
    app.get('/', function (req, res, next) {
        if (req.user/* && req.user.privilegeLevel === 'student'*/)
            res.redirect('/home');
        //if (req.user && req.user.privilegeLevel === 'teacher')
        //    res.redirect('/teacher');
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
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/loggedin', function (req, res) {
        if (req.user.privilegeLevel)
            res.redirect('/home');
        // else if (req.user.privilegeLevel === 'student')
        //     res.redirect('/student');
        else
            res.redirect('/login');
    });

    app.get('/home', function (req, res, next) {
        if (!req.user) {
            res.redirect('/')
        }
        else if (req.user.privilegeLevel === "teacher") {
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

    app.post('/createSection', isTeacher, function (req, res, next) {
        tempSectionId = (sections[sections.length - 1].sectionId) + 1;

        sections.push({ quarter: req.body.quarter, year: parseInt(req.body.year), description: req.body.description, sectionId: tempSectionId, courseId: parseInt(req.body.courseId), passcode: req.body.passcode });

        res.redirect('/home');
    });

    app.get('/deleteCourse', isTeacher, function (req, res, next) {
        console.log(req.query.courseId);

        res.redirect('/home');
    });

    app.get('/deleteSection', isTeacher, function (req, res, next) {
        console.log(req.query.sectionId);

        res.redirect('/home');
    });

    app.post('/createCourse', isTeacher, function (req, res, next) {
        tempCourseId = (courses[courses.length - 1].courseId) + 1;

        courses.push({ courseName: req.body.courseName, courseId: tempCourseId, owner: req.user.email });

        res.redirect('/home');
    });

    app.post("/hideTopic", isTeacher, function (req, res, next) {
        console.log(req.body);

        for (counter = 0; counter < courseTopics.length; counter++) {
            if (courseTopics[counter].topicId === parseInt(req.body.topicId)) {
                if (req.body.method === "Show To Students")
                    courseTopics[counter].visible = true
                else
                    courseTopics[counter].visible = false

                res.send({ visible: courseTopics[counter].visible })
            }
        }
    });

    app.post("/hideResource", isTeacher, function (req, res, next) {
        console.log(req.body);

        for (counter = 0; counter < resources.length; counter++) {
            if (resources[counter].resourceId === parseInt(req.body.resourceId)) {
                if (req.body.method === "Show To Students")
                    resources[counter].visible = true
                else
                    resources[counter].visible = false

                res.send({ visible: resources[counter].visible })
            }
        }
    });

    app.post('/addSection', function (req, res, next) {
        console.log(req.body);
        if (req.body.passcode) {
            console.log("we have a passcode");
        }

        //check if already enrolled
        tempEnrollmentId = enrollments[enrollments.length - 1].enrollmentId + 1;
        tempSectionId = parseInt(req.body.sectionId);
        tempEmail = req.user.email;

        enrollments.push({ email: tempEmail, enrollmentId: tempEnrollmentId, sectionId: tempSectionId });

        res.redirect('/home');
    });

    app.get('/deleteTopic', function (req, res, next) {
        console.log(req.query.topicId);

        res.redirect('/section/' + req.query.sectionId);
    });

    app.get('/deleteResource', function (req, res, next) {
        console.log(req.query.resourceId);

        res.redirect('/section/' + req.query.sectionId);
    });

    app.post('/addTopic', function (req, res, next) {
        var tempSectionId = parseInt(req.body.sectionId);
        var tempTopicName = req.body.topicName;
        var tempTopicDescription = req.body.topicDescription;

        tempTopicId = (courseTopics[courseTopics.length - 1].topicId) + 1;

        courseTopics.push({ topicName: req.body.topicName, topicId: tempTopicId, topicDescription: tempTopicDescription, sectionId: tempSectionId });

        res.redirect('/section/' + tempSectionId);
    });

    app.post('/addResource', upload.single('fileLocation'), function (req, res, next) {
        //console.log(req.body);
        //console.log(req.file.filename);

        var tempSectionId = parseInt(req.body.sectionId);
        var tempTopicId = parseInt(req.body.topicId);
        var tempResourceName = req.body.resourceName;
        var tempResourceType = req.body.resourceType;
        var tempResourceLocation = "";
        if (tempResourceType === "video") {
            tempResourceLocation = req.body.videoLocation;
        }
        else if (tempResourceType === "file") {
            tempResourceLocation = req.file.filename;
        }
        else {
            tempResourceLocation = 'problem.js';
        }

        tempResourceId = (resources[resources.length - 1].resourceId) + 1;

        resources.push({ resourceName: tempResourceName, topicId: tempTopicId, resourceType: tempResourceType, resourceLocation: tempResourceLocation, resourceId: tempResourceId });

        console.log(resources[resources.length - 1]);
        res.redirect('/section/' + req.body.sectionId);
    });

    app.get('/courses', function (req, res, next) {
        var tempCourses = [];

        if (req.user.privilegeLevel === 'teacher') {
            for (course of courses) {
                if (course.owner === req.user.email) {
                    tempCourses.push(course);
                }
            }
        }
        if (req.user.privilegeLevel === 'student') {
            for (enrollment of enrollments) {
                if (enrollment.email === req.user.email) {
                    for (section of sections) {
                        if (section.sectionId === enrollment.sectionId) {
                            for (course of courses) {
                                if (course.courseId === section.courseId) {
                                    if (tempCourses.indexOf(course) < 0) {
                                        tempCourses.push(course);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        res.send(tempCourses);
    });

    app.get('/sections/:course', function (req, res, next) {
        var tempSections = [];

        if (req.user.privilegeLevel === 'teacher') {
            for (section of sections) {
                if (section.courseId === parseInt(req.params['course'])) {
                    tempSections.push(section);
                }
            }

        }

        if (req.user.privilegeLevel === 'student') {
            for (enrollment of enrollments) {
                if (enrollment.email === req.user.email) {
                    for (section of sections) {
                        if (section.sectionId === enrollment.sectionId && section.courseId === parseInt(req.params['course'])) {
                            tempSections.push(section);
                        }
                    }
                }
            }
        }

        res.send(tempSections);
    });

    app.get('/topics/:section', function (req, res, next) {
        var tempTopics = [];

        for (topic of courseTopics) {
            if (topic.sectionId === parseInt(req.params['section']) && (topic.visible === true || req.user.privilegeLevel === "teacher")) {
                tempTopics.push(topic);
            }
        }



        res.send(tempTopics);
    });

    app.get('/resources/:topic', function (req, res, next) {
        var tempResources = [];

        for (resource of resources) {
            if (resource.topicId === parseInt(req.params['topic']) && (resource.visible === true || req.user.privilegeLevel === "teacher")) {
                tempResources.push(resource);
            }
        }

        res.send(tempResources);
    });

    app.get('/section/:section', function (req, res, next) {
        var tempCourseName = "Math " + '101';
        if (!req.user) {
            console.log("user not found");
            res.redirect('/')
        }
        else if (req.user.privilegeLevel === 'student') {
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

    app.get('/resource/:resource', function (req, res, next) {
        var tempResource;
        var tempTopic;
        var tempCourse;
        var tempSection;

        for (resource of resources) {
            if (resource.resourceId === parseInt(req.params['resource'])) {
                tempResource = resource;
            }
        }
        for (topic of courseTopics) {
            if (tempResource.topicId === topic.topicId) {
                tempTopic = topic;
            }
        }
        for (section of sections) {
            if (tempTopic.sectionId === section.sectionId) {
                tempSection = section;
            }
        }
        for (course of courses) {
            if (tempSection.courseId === course.courseId) {
                tempCourse = course;
            }
        }
        var tempCourseName = tempCourse.courseName + '-' + tempSection.sectionId;
        var tempTopicName = tempTopic.topicName;
        var tempSectionId = tempSection.sectionId;

        if (!req.user) {
            res.redirect('/')
        }
        else {

            if (tempResource.resourceType === 'video') {
                res.render('video', {
                    title: studentName,
                    courseName: tempCourseName,
                    topicName: tempTopicName,
                    sectionId: tempSectionId,
                    videoName: tempResource.resourceName,
                    videoAddress: tempResource.resourceLocation
                });
            }
            else if (tempResource.resourceType === 'problem') {
                res.render('problem', {
                    title: studentName,
                    courseName: tempCourseName,
                    topicName: tempTopicName,
                    sectionId: tempSectionId,
                    problemName: tempResource.resourceName,
                    problemJs: tempResource.resourceLocation
                });
            }
            else {
                res.sendFile(filepath + tempResource.resourceLocation);
            }
        }
    });

    /*app.get('/teacher/resource/:resource', isTeacher, function (req, res, next) {
        var tempTopicName = 'topicName';
        var tempCourseName = 'courseName';
        var tempSectionId = '1';
        var resourceType = 'video';
        var tempResourceName = 'resourceName';


    });*/

    //app.get('/teacher/file/:file', function (req, res, next) {
    //    res.sendFile(filepath + req.params['file']);
    //});

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    //some temporary variables while database is down
    var courses = [
        { courseId: 1, courseName: 'Math 101', owner: 'teacher@teacher.com' },
        { courseId: 2, courseName: 'Math 102', owner: 'teacher@teacher.com' },
        { courseId: 3, courseName: 'Math 103', owner: 'teache2@teacher.com' },
        { courseId: 4, courseName: 'Math 104', owner: 'teacher2@teacher.com' }
    ];

    var sections = [
        { sectionId: 1, courseId: 1, description: 'some Description', quarter: 'Spring', year: 2018 },
        { sectionId: 2, courseId: 1, description: 'some Description', quarter: 'Summer', year: 2019 },
        { sectionId: 3, courseId: 2, description: 'some Description', quarter: 'Fall', year: 2017 }
    ];

    var enrollments = [
        { enrollmentId: 1, sectionId: 1, email: 'student@student.com' },
        { enrollmentId: 2, sectionId: 2, email: 'student@student.com' },
        { enrollmentId: 3, sectionId: 2, email: 'student2@student.com' },
        { enrollmentId: 4, sectionId: 3, email: 'student2@student.com' }
    ];

    var courseTopics = [
        { topicId: 1, sectionId: 1, topicName: 'TopicName 1', topicDescription: 'someDescription1', visible: true },
        { topicId: 2, sectionId: 1, topicName: 'TopicName 2', topicDescription: 'someDescription2', visible: false },
        { topicId: 3, sectionId: 1, topicName: 'TopicName 3', topicDescription: 'someDescription3', visible: false },
        { topicId: 4, sectionId: 2, topicName: 'TopicName 4', topicDescription: 'someDescription4', visible: false },
        { topicId: 5, sectionId: 2, topicName: 'TopicName 5', topicDescription: 'someDescription5', visible: false },
        { topicId: 6, sectionId: 2, topicName: 'TopicName 6', topicDescription: 'someDescription6', visible: false },
        { topicId: 7, sectionId: 3, topicName: 'TopicName 7', topicDescription: 'someDescription7', visible: false },
        { topicId: 8, sectionId: 3, topicName: 'TopicName 8', topicDescription: 'someDescription8', visible: false },
        { topicId: 9, sectionId: 3, topicName: 'TopicName 9', topicDescription: 'someDescription9', visible: false }
    ];

    var resources = [
        { resourceId: 1, topicId: 1, resourceName: 'RName 1', resourceType: 'problem', resourceLocation: 'problem.js', visible: true },
        { resourceId: 2, topicId: 1, resourceName: 'RName 2', resourceType: 'video', resourceLocation: 'location', visible: true },
        { resourceId: 3, topicId: 1, resourceName: 'RName 3', resourceType: 'file', resourceLocation: 'Hotel ERD.pdf', visible: false },
        { resourceId: 4, topicId: 2, resourceName: 'RName 4', resourceType: 'problem', resourceLocation: 'location', visible: false },
        { resourceId: 5, topicId: 2, resourceName: 'RName 5', resourceType: 'video', resourceLocation: 'location', visible: false },
        { resourceId: 6, topicId: 2, resourceName: 'RName 6', resourceType: 'file', resourceLocation: 'location', visible: false },
        { resourceId: 7, topicId: 3, resourceName: 'RName 7', resourceType: 'problem', resourceLocation: 'location', visible: false },
        { resourceId: 8, topicId: 3, resourceName: 'RName 8', resourceType: 'video', resourceLocation: 'location', visible: false },
        { resourceId: 9, topicId: 3, resourceName: 'RName 9', resourceType: 'file', resourceLocation: 'location', visible: false },
        { resourceId: 10, topicId: 4, resourceName: 'RName 10', resourceType: 'problem', resourceLocation: 'location', visible: false },
        { resourceId: 11, topicId: 4, resourceName: 'RName 11', resourceType: 'video', resourceLocation: 'location', visible: false },
        { resourceId: 12, topicId: 4, resourceName: 'RName 12', resourceType: 'file', resourceLocation: 'location', visible: false },
        { resourceId: 13, topicId: 5, resourceName: 'RName 13', resourceType: 'problem', resourceLocation: 'location', visible: false },
        { resourceId: 14, topicId: 5, resourceName: 'RName 14', resourceType: 'video', resourceLocation: 'location', visible: false },
        { resourceId: 15, topicId: 5, resourceName: 'RName 15', resourceType: 'file', resourceLocation: 'location', visible: false },
        { resourceId: 16, topicId: 6, resourceName: 'RName 16', resourceType: 'problem', resourceLocation: 'location', visible: false },
        { resourceId: 17, topicId: 6, resourceName: 'RName 17', resourceType: 'video', resourceLocation: 'location', visible: false },
        { resourceId: 18, topicId: 6, resourceName: 'RName 18', resourceType: 'file', resourceLocation: 'location', visible: false },
        { resourceId: 19, topicId: 7, resourceName: 'RName 19', resourceType: 'problem', resourceLocation: 'location', visible: false },
        { resourceId: 20, topicId: 7, resourceName: 'RName 20', resourceType: 'video', resourceLocation: 'location', visible: false },
        { resourceId: 21, topicId: 7, resourceName: 'RName 21', resourceType: 'file', resourceLocation: 'location', visible: false },
        { resourceId: 22, topicId: 8, resourceName: 'RName 22', resourceType: 'problem', resourceLocation: 'location', visible: false },
        { resourceId: 23, topicId: 8, resourceName: 'RName 23', resourceType: 'video', resourceLocation: 'location', visible: false },
        { resourceId: 24, topicId: 8, resourceName: 'RName 24', resourceType: 'file', resourceLocation: 'location', visible: false },
        { resourceId: 25, topicId: 9, resourceName: 'RName 25', resourceType: 'problem', resourceLocation: 'location', visible: false },
        { resourceId: 26, topicId: 9, resourceName: 'RName 26', resourceType: 'video', resourceLocation: 'location', visible: false },
        { resourceId: 27, topicId: 9, resourceName: 'RName 27', resourceType: 'file', resourceLocation: 'location', visible: false },
    ];
};

function isTeacher(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.user && req.user.privilegeLevel === 'teacher')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.user)
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}