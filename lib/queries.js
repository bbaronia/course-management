var mysql = require('mysql');
var dbconfig = require('./database');
var validator = require('validator');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = {
    createCourse: function(courseName, owner){

    },
    createSection: function(quarter, year, description, courseId, passcode) {

    },
    createTopic: function(sectionId, topicName, topicDescription) {

    },
    createResource: function(sectionId, topicId, resourceName, resourceType, resourceLocation) {

    },
    deleteCourse: function(courseId) {

    },
    deleteSection: function(sectionId) {

    },
    deleteTopic: function(topicId) {

    },
    deleteResource: function(resourceId) {

    },
    getCourses: function(email) {

    },
    getSections: function(courseId, email) {

    },
    getTopics: function(sectionId, email) {

    },
    getResources: function(resourceId, email) {

    },
    getSection: function(sectionId, email) {

    },
    getResource: function(resourceId, email) {

    }
}