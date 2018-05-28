var express = require('express');
//var passport = require('passport');
//var session = require('express-session');
//var mysql = require('mysql');
var router = express.Router();

//Make a pool of connections to DB
//var pool = mysql.createPool({
//    host: '',
//    user: '',
//    password: '',
//    database: ''
//})

var teacherName = 'Teaching';
var studentName = 'Learning';
var websiteName = 'Website';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: websiteName });
});

router.post('/login', function(req, res, next) {
    console.log(req.body);

    //Do proper login stuff here
    if (req.body.email === "s@s.s" && req.body.password === "s") {
        res.redirect('../student');
    }
    if (req.body.email === "t@t.t" && req.body.password === "t") {
        res.redirect('../teacher');
    }
    res.redirect('..');
    //res.render('student', { title: websiteName });
});

router.get('/teacher', function(req, res, next) {
    res.render('teacher', { title: teacherName });
});

router.get('/student', function(req, res, next) {
    res.render('student', { title: studentName });
});

router.get('/student/:course-:section', function(req, res, next) {
    res.render('studentCourse', { title: studentName, courseName: (req.params['course'] + "-" + req.params['section']) });
});

router.get('/teacher/:course-:section', function(req, res, next) {
    res.render('teacherCourse', { title: teacherName, courseName: req.params['course'] + "-" + req.params['section'] });
});

router.get('/student/:course-:section/:topic/problem=:problem', function(req, res, next) {
    res.render('problem', { title: studentName, courseName: req.params['course'] + "-" + req.params['section'], topicName: req.params['topic'], problemName: req.params['problem'] });
});

router.get('/student/:course-:section/:topic/video=:video', function(req, res, next) {
    res.render('video', {
        title: studentName,
        courseName: req.params['course'] + "-" + req.params['section'],
        topicName: req.params['topic'],
        videoName: req.params['video']
    });
});

module.exports = router;