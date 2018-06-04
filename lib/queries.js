//Load in requirements
var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
var bcrypt = require('bcrypt-nodejs');

//Connect to DB
connection.query('USE ' + dbconfig.database);

//Functions to use for DB management
module.exports = {
    //Create a new user
    createUser: function (email, firstName, lastName, passwd, privilegeLevel, next) {
        var check = "SELECT * from Users where email = ?";
        var query = "INSERT INTO Users (email, firstName, lastName, passwd, privilegeLevel) values (?,?,?,?,?)";
        connection.query(check, [email], function (err, rows) {
            //Make sure user doesn't already exist
            if (!rows || !rows.length) {
                connection.query(query, [email, firstName, lastName, bcrypt.hashSync(passwd, null, null), privilegeLevel], function (err, rows) {
                    next();
                });
            }
            else
                next();
        });
    },
    //Create a new course
    createCourse: function (courseName, email, next) {
        var query = "INSERT INTO Courses (courseName, owner) values (?,?)";
        connection.query(query, [courseName, email], function (err, rows) {
            next();
        });
    },
    //Create a new section
    createSection: function (email, quarter, year, description, courseId, passcode, next) {
        var check = "SELECT * FROM Courses WHERE owner=? AND courseId = ?";
        var query = "INSERT INTO Sections(quarter, year, description, courseId, passcode) values (?,?,?,?,?)";

        connection.query(check, [email, courseId], function (err, rows) {
            if (rows && rows.length) {
                // user owns course
                //create section
                connection.query(query, [quarter, year, description, courseId, passcode], function (err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    //Create a new topic
    createTopic: function (email, sectionId, topicName, topicDescription, next) {
        var check = "SELECT * FROM Courses c, Sections s WHERE c.owner=? AND s.sectionId = ? AND s.courseId = c.courseId";
        var query = "INSERT INTO Topics (sectionId, topicName, topicDescription, visible) values (?,?,?, false)";
        var lastResult = "SELECT LAST_INSERT_ID() AS topicId";
        var nextQuery = "INSERT INTO TopicMap (sectionId, topicId) values (?,?)";

        connection.query(check, [email, sectionId], function (err, rows) {
            if (rows && rows.length) {
                // user owns course
                //create topic
                connection.query(query, [sectionId, topicName, topicDescription], function (err, rows) {
                    connection.query(lastResult, function (err, rows) {
                        if (rows && rows.length) {
                            // topic created
                            // add to map
                            connection.query(nextQuery, [sectionId, rows[0].topicId], function (err, rows) {
                                next();
                            });
                        }
                        else {
                            next()
                        }
                    });
                });
            }
            else {
                next()
            }
        });
    },
    //Create a new resource
    createResource: function (email, topicId, resourceName, resourceType, resourceLocation, next) {
        var check = "SELECT * FROM Courses c, Sections s, Topics t WHERE c.owner=? AND t.topicId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId";
        var query = "INSERT INTO Resources (topicId, resourceName, resourceType, resourceLocation, visible) values (?,?,?,?, false)";

        connection.query(check, [email, topicId], function (err, rows) {
            if (rows && rows.length) {
                // user owns course
                //create resource
                connection.query(query, [topicId, resourceName, resourceType, resourceLocation], function (err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    //Delete a course
    deleteCourse: function (email, courseId, next) {
        var check = "SELECT * FROM Courses WHERE owner=? AND courseId = ?";
        var query = "DELETE FROM Courses WHERE courseId = ?";

        connection.query(check, [email, courseId], function (err, rows) {
            if (rows && rows.length) {
                // user owns course
                //delete course
                connection.query(query, [courseId], function (err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    //Delete a section
    deleteSection: function (email, sectionId, next) {
        var check = "SELECT * FROM Courses c, Sections s WHERE c.owner=? AND s.sectionId = ? AND s.courseId = c.courseId";
        var query = "DELETE FROM Sections WHERE sectionId = ?";

        connection.query(check, [email, sectionId], function (err, rows) {
            if (rows && rows.length) {
                // user owns course
                //delete section
                connection.query(query, [sectionId], function (err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    //Delete a topic
    deleteTopic: function (email, topicId, next) {
        var check = "SELECT * FROM Courses c, Sections s, Topics t WHERE c.owner=? AND t.topicId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId";
        var query = "DELETE FROM Topics WHERE topicId = ?";

        connection.query(check, [email, topicId], function (err, rows) {
            if (rows && rows.length) {
                // user owns course
                //delete Topic
                connection.query(query, [topicId], function (err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    //Delete a resource
    deleteResource: function (email, resourceId, next) {
        var check = "SELECT * FROM Courses c, Sections s, Topics t, Resources r WHERE c.owner=? AND r.resourceId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId AND r.topicId = t.topicId";
        var query = "DELETE FROM Resources WHERE resourceId = ?";

        connection.query(check, [email, resourceId], function (err, rows) {
            if (rows && rows.length) {
                // user owns course
                //delete resource
                connection.query(query, [resourceId], function (err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    //Toggle hide/show topic
    hideTopic: function (email, topicId, visible, next) {
        var check = "SELECT * FROM Courses c, Sections s, Topics t WHERE c.owner=? AND t.topicId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId";
        var query = "UPDATE Topics SET visible = ? WHERE topicId = ?";

        connection.query(check, [email, topicId], function (err, rows) {
            if (rows && rows.length) {
                // user owns course
                //update topic visibility
                connection.query(query, [visible, topicId], function (err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    //Toggle hide/show resource
    hideResource: function (email, resourceId, visible, next) {
        var check = "SELECT * FROM Courses c, Sections s, Topics t, Resources r WHERE c.owner=? AND r.resourceId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId AND r.topicId = t.topicId";
        var query = "UPDATE Resources SET visible = ? WHERE resourceId = ?";

        connection.query(check, [email, resourceId], function (err, rows) {
            if (rows && rows.length) {
                // user owns course
                //Update resource visibility
                connection.query(query, [visible, resourceId], function (err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    },
    //Get all courses owned/subscribed to by user
    getCourses: function (email, next) {
        var query = "SELECT DISTINCT c.* FROM Courses c, Sections s, Enrollments e WHERE c.owner=? OR (e.email = ? AND e.sectionId = s.sectionId AND s.courseId = c.courseId)";

        connection.query(query, [email, email], function (err, rows) {
            next(rows);
        });
    },
    //Get all sections of course owned/subscribed to by user
    getSections: function (courseId, email, next) {
        var query = "SELECT DISTINCT s.* FROM Courses c, Sections s, Enrollments e WHERE (c.owner=? AND s.courseId = ? AND s.courseId = c.courseId) OR (e.email =? AND s.courseId = ? AND e.sectionId = s.sectionId)";
        connection.query(query, [email, courseId, email, courseId], function (err, rows) {
            next(rows);
        });
    },
    //Get all topics of section owned/subscribed to by user
    getTopics: function (sectionId, email, next) {
        var query = "SELECT DISTINCT t.* FROM Courses c, Sections s, Enrollments e, Topics t, TopicMap m WHERE (c.owner=? AND s.sectionId = ? AND s.courseId = c.courseId AND m.sectionId = s.sectionId AND m.topicId = t.topicId) OR (e.email=? AND e.sectionId = ? AND e.sectionId = m.sectionId AND m.topicId = t.topicId AND t.visible)";
        connection.query(query, [email, sectionId, email, sectionId], function (err, rows) {
            next(rows);
        });
    },
    //Get all resources of topic owned/subscribed to by user
    getResources: function (topicId, email, next) {
        var query = "SELECT DISTINCT r.* FROM Courses c, Sections s, Enrollments e, Topics t, Resources r WHERE (c.owner=? AND t.topicId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId AND t.topicId = r.topicId) OR (e.email=? AND t.topicId = ? AND e.sectionId = t.sectionId AND r.topicId = t.topicId AND r.visible)";
        connection.query(query, [email, topicId, email, topicId], function (err, rows) {
            next(rows);
        });
    },
    //Get course info from section
    getSection: function (sectionId, email, next) {
        var query = "SELECT DISTINCT c.* FROM Courses c, Sections s, Enrollments e WHERE (c.owner=? AND s.sectionId = ? AND c.courseId = s.courseId) OR (e.email = ? AND s.sectionId = ? AND e.sectionId = s.sectionId AND s.courseId = c.courseId)";
        connection.query(query, [email, sectionId, email, sectionId], function (err, rows) {
            next(rows);
        });
    },
    //Get specific information based on resource required to render page
    getResource: function (resourceId, email, next) {
        var query = "SELECT DISTINCT c.courseName, s.sectionId, t.topicName, r.resourceName, r.resourceLocation, r.resourceType FROM Courses c, Sections s, Enrollments e, Topics t, Resources r WHERE (c.owner=? AND r.resourceId = ? AND s.courseId = c.courseId AND t.sectionId = s.sectionId AND t.topicId = r.topicId) OR (e.email = ? AND r.resourceId = ? AND e.sectionId = t.sectionId AND s.sectionId = t.sectionId AND r.topicId = t.topicId AND c.courseId = s.courseId AND r.visible)";
        connection.query(query, [email, resourceId, email, resourceId], function (err, rows) {
            next(rows);
        });
    },
    //Subscribe to section
    addSection: function (email, sectionId, passcode, next) {
        var check = "SELECT * FROM Sections WHERE sectionId = ? AND passcode = ?";
        var query = "INSERT INTO Enrollments(sectionId, email) VALUES (?,?)";

        connection.query(check, [sectionId, passcode], function (err, rows) {
            if (rows && rows.length) {
                //correct passcode
                //add section
                connection.query(query, [sectionId, email], function (err, rows) {
                    next();
                });
            }
            else {
                next()
            }
        });
    }
}