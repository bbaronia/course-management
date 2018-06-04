var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
var bcrypt = require('bcrypt-nodejs');

connection.query('USE ' + dbconfig.database);

module.exports = {
    createUser: function(email, firstName, lastName, passwd, privilegeLevel, next) {
        var query =  "INSERT INTO Users (email, firstName, lastName, passwd, privilegeLevel) values (?,?,?,?,?)";
        connection.query(query,[email, firstName, lastName, passwd, privilegeLevel], function(err, rows) {
            next();
        });
    },
    createCourse: function(courseName, email, next){
        var query =  "INSERT INTO Courses (courseName, owner) values (?,?)";
        connection.query(query,[courseName, email], function(err, rows) {
            next();
        });
    },
    createSection: function(email, quarter, year, description, courseId, passcode, next) {
        var check = "SELECT * FROM Courses WHERE owner=? AND courseId = ?";
        var query =  "INSERT INTO Sections(quarter, year, description, courseId, passcode) values (?,?,?,?,?)";

        connection.query(check,[email, courseId], function(err, rows) {
            if (rows.length) {
                // user owns course
                //create section
                connection.query(query,[quarter, year, description, courseId, passcode],function(err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    createTopic: function(email, sectionId, topicName, topicDescription, next) {
        var check = "SELECT * FROM Courses c, Sections s WHERE c.owner=? AND s.sectionId = ? AND s.courseId = c.courseId";
        var query =  "INSERT INTO Topics (sectionId, topicName, topicDescription) values (?,?,?)";

        connection.query(check,[email, sectionId], function(err, rows) {
            if (rows.length) {
                // user owns course
                //create topic
                connection.query(query,[sectionId, topicName, topicDescription],function(err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    createResource: function(email, topicId, resourceName, resourceType, resourceLocation, next) {
        var check = "SELECT * FROM Courses c, Sections s, Topics t WHERE c.owner=? AND t.topicId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId";
        var query =  "INSERT INTO Resources (topicId, resourceName, resourceType, resourceLocation) values (?,?,?,?)";

        connection.query(check,[email, topicId], function(err, rows) {
            if (rows.length) {
                // user owns course
                //create resource
                connection.query(query,[topicId, resourceName, resourceType, resourceLocation],function(err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    deleteCourse: function(email, courseId, next) {
        var check = "SELECT * FROM Courses WHERE owner=? AND courseId = ?";
        var query =  "DELETE FROM Courses WHERE courseId = ?";

        connection.query(check,[email, courseId], function(err, rows) {
            if (rows.length) {
                // user owns course
                //create resource
                connection.query(query,[courseId],function(err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    deleteSection: function(email, sectionId, next) {
        var check = "SELECT * FROM Courses c, Sections s WHERE c.owner=? AND s.sectionId = ? AND s.courseId = c.courseId";
        var query =  "DELETE FROM Sections WHERE sectionId = ?";

        connection.query(check,[email, sectionId], function(err, rows) {
            if (rows.length) {
                // user owns course
                //create resource
                connection.query(query,[sectionId],function(err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    deleteTopic: function(email, topicId, next) {
        var check = "SELECT * FROM Courses c, Sections s, Topics t WHERE c.owner=? AND t.topicId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId";
        var query =  "DELETE FROM Topics WHERE topicId = ?";

        connection.query(check,[email, topicId], function(err, rows) {
            if (rows.length) {
                // user owns course
                //create resource
                connection.query(query,[topicId],function(err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    deleteResource: function(email, resourceId, next) {
        var check = "SELECT * FROM Courses c, Sections s, Topics t, Resources r WHERE c.owner=? AND r.resourceId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId AND r.topicId = t.topicId";
        var query =  "DELETE FROM Resources WHERE resourceId = ?";

        connection.query(check,[email, resourceId], function(err, rows) {
            if (rows.length) {
                // user owns course
                //create resource
                connection.query(query,[resourceId],function(err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    getCourses: function(email, next) {
        var query = "SELECT DISTINCT c.* FROM Courses c, Sections s, Enrollments e WHERE c.owner=? OR (e.email = ? AND e.sectionId = s.sectionId AND s.courseId = c.courseId)";

        connection.query(query,[email, email],function(err, rows) {
            next(rows);
        });
    },
    getSections: function(courseId, email, next) {
        var query = "SELECT DISTINCT s.* FROM Courses c, Sections s, Enrollments e WHERE (c.owner=? AND s.courseId = ? AND s.courseId = c.courseId) OR (e.email =? AND s.courseId = ? AND e.sectionId = s.sectionId)";
        connection.query(query,[email, courseId, email, courseId],function(err, rows) {
            next(rows);
        });
    },
    getTopics: function(sectionId, email, next) {
        var query = "SELECT DISTINCT t.* FROM Courses c, Sections s, Enrollments e, Topics t WHERE (c.owner=? AND s.sectionId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId) OR (e.email=? AND e.sectionId = ? AND e.sectionId = t.sectionId AND t.visible)";
        connection.query(query,[email, sectionId, email, sectionId],function(err, rows) {
            next(rows);
        });
    },
    getResources: function(topicId, email, next) {
        var query = "SELECT DISTINCT r.* FROM Courses c, Sections s, Enrollments e, Topics t, Resources r WHERE (c.owner=? AND t.topicId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId AND t.topicId = r.topicId) OR (e.email=? AND t.topicId = ? AND e.sectionId = t.sectionId AND r.topicId = t.topicId AND r.visible)";
        connection.query(query,[email, topicId, email, topicId],function(err, rows) {
            next(rows);
        });
    },
    getSection: function(sectionId, email, next) {
        var query = "SELECT DISTINCT c.* FROM Courses c, Sections s, Enrollments e WHERE (c.owner=? AND s.sectionId = ? AND c.courseId = s.courseId) OR (e.email = ? AND s.sectionId = ? AND e.sectionId = s.sectionId AND s.courseId = c.courseId)";
        connection.query(query,[email, sectionId, email, sectionId],function(err, rows) {
            next(rows);
        });
    },
    getResource: function(resourceId, email, next) {
        var query = "SELECT DISTINCT c.courseName, s.sectionId, t.topicName, r.resourceName, r.resourceLocation, r.resourceType FROM Courses c, Sections s, Enrollments e, Topics t, Resources r WHERE (c.owner=? AND r.resourceId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId AND t.topicId = r.topicId) OR (e.email = ? AND r.resourceId = ? AND e.sectionId = t.sectionId AND s.sectionId = t.sectionId AND r.topicId = t.topicId AND c.courseId = s.courseId AND r.visible)";
        connection.query(query,[email, resourceId, email, resourceId],function(err, rows) {
            next(rows);
        });
    }
}