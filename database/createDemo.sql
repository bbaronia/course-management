INSERT INTO Users(email, firstName, lastName, passwd, privilegeLevel) VALUES
('student@student.com', 'SFirst', 'SLast', '$2a$10$.0JRRGx29BtWSzhEWLOV4uLQzeqSEa7gfg513Ge1r4cWyPYoKrHDC', 'student');

INSERT INTO Users(email, firstName, lastName, passwd, privilegeLevel) VALUES
('teacher@teacher.com', 'TFirst', 'TLast', '$2a$10$aOR.ZbJjC.k7q8ovAbsdpOsuKfByidr26k9vhrgQ1zuDvQMc9YrcO', 'teacher');

INSERT INTO Users(email, firstName, lastName, passwd, privilegeLevel) VALUES
('student2@student.com', 'SFirst', 'SLast', '$2a$10$.0JRRGx29BtWSzhEWLOV4uLQzeqSEa7gfg513Ge1r4cWyPYoKrHDC', 'student');

INSERT INTO Users(email, firstName, lastName, passwd, privilegeLevel) VALUES
('teacher2@teacher.com', 'TFirst', 'TLast', '$2a$10$aOR.ZbJjC.k7q8ovAbsdpOsuKfByidr26k9vhrgQ1zuDvQMc9YrcO', 'teacher');

INSERT INTO Courses(courseName, owner) VALUES
('Math 101', 'teacher@teacher.com');

INSERT INTO Courses(courseName, owner) VALUES
('Math 101', 'teacher2@teacher.com');

INSERT INTO Sections(courseId, description, quarter, year, passcode) VALUES
(1, 'A demo section for Math 101', 'Spring', 2018, '');

INSERT INTO Sections(courseId, description, quarter, year, passcode) VALUES
(1, 'Another demo section for Math 101', 'Spring', 2019, '1111');

INSERT INTO Sections(courseId, description, quarter, year, passcode) VALUES
(2, 'A demo section for Math 101', 'Spring', 2018, '');

INSERT INTO Sections(courseId, description, quarter, year, passcode) VALUES
(2, 'Another demo section for Math 101', 'Spring', 2019, '1111');

INSERT INTO Enrollments(sectionId, email) VALUES
(1, 'student@student.com');

INSERT INTO Enrollments(sectionId, email) VALUES
(3, 'student2@student.com');

INSERT INTO Topics(sectionId, topicName, topicDescription, visible) VALUES
(1, 'Graphs', 'A demo topic for Math 101-1', false);

INSERT INTO Topics(sectionId, topicName, topicDescription, visible) VALUES
(1, 'Lines', 'Another demo topic for Math 101-1', true);

INSERT INTO Topics(sectionId, topicName, topicDescription, visible) VALUES
(2, 'Graphs', 'A demo topic for Math 101-2', false);

INSERT INTO Topics(sectionId, topicName, topicDescription, visible) VALUES
(2, 'Lines', 'Another demo topic for Math 101-2', true);

INSERT INTO Topics(sectionId, topicName, topicDescription, visible) VALUES
(3, 'Graphs', 'A demo topic for Math 101-3', false);

INSERT INTO Topics(sectionId, topicName, topicDescription, visible) VALUES
(3, 'Lines', 'Another demo topic for Math 101-3', true);

INSERT INTO Topics(sectionId, topicName, topicDescription, visible) VALUES
(4, 'Graphs', 'A demo topic for Math 101-4', false);

INSERT INTO Topics(sectionId, topicName, topicDescription, visible) VALUES
(4, 'Lines', 'Another demo topic for Math 101-4', true);

INSERT INTO TopicMap(sectionId, topicId) VALUES
(1, 1);

INSERT INTO TopicMap(sectionId, topicId) VALUES
(1, 2);

INSERT INTO TopicMap(sectionId, topicId) VALUES
(2, 3);

INSERT INTO TopicMap(sectionId, topicId) VALUES
(2, 4);

INSERT INTO TopicMap(sectionId, topicId) VALUES
(3, 5);

INSERT INTO TopicMap(sectionId, topicId) VALUES
(3, 6);

INSERT INTO TopicMap(sectionId, topicId) VALUES
(4, 7);

INSERT INTO TopicMap(sectionId, topicId) VALUES
(4, 8);

INSERT INTO Resources(topicId, resourceName, resourceType, resourceLocation, visible) VALUES
(1, 'Graph Video', 'video', 'https://www.youtube.com/embed/86NwKBcOlow', true);

INSERT INTO Resources(topicId, resourceName, resourceType, resourceLocation, visible) VALUES
(1, 'Graph Problem', 'problem', 'problem.js', false);

INSERT INTO Resources(topicId, resourceName, resourceType, resourceLocation, visible) VALUES
(2, 'Line Video', 'video', 'https://www.youtube.com/embed/woUQ9LLaees', true);

INSERT INTO Resources(topicId, resourceName, resourceType, resourceLocation, visible) VALUES
(2, 'Line Notes', 'file', 'Graph Notes.pdf', false);

INSERT INTO Resources(topicId, resourceName, resourceType, resourceLocation, visible) VALUES
(3, 'Graph Video', 'video', 'https://www.youtube.com/embed/36v2EXZRzUE', true);

INSERT INTO Resources(topicId, resourceName, resourceType, resourceLocation, visible) VALUES
(3, 'Graph Problem', 'problem', 'problem.js', false);

INSERT INTO Resources(topicId, resourceName, resourceType, resourceLocation, visible) VALUES
(4, 'Line Video', 'video', 'https://www.youtube.com/embed/uk7gS3cZVp4', true);

INSERT INTO Resources(topicId, resourceName, resourceType, resourceLocation, visible) VALUES
(4, 'Line Notes', 'file', 'Graph Notes 2.pdf', false);