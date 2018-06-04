DROP TABLE IF EXISTS Resources;
DROP TABLE IF EXISTS CourseTopics;
DROP TABLE IF EXISTS ResourceTypes;
DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS Sections;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    email varchar(50) NOT NULL,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    passwd varchar(60) NOT NULL,
    privilegeLevel ENUM('teacher', 'student') NOT NULL
);

CREATE TABLE Courses (
    courseId int auto_increment PRIMARY KEY,
    courseName varchar(50) NOT NULL,
    owner varchar(50) REFERENCES Users(email)
);

CREATE TABLE Sections (
    sectionId int auto_increment PRIMARY KEY,
    courseId int REFERENCES Courses(courseId),
    description varchar(100) NOT NULL,
    quarter ENUM('Spring', 'Summer', 'Fall', 'Winter') NOT NULL,
    year int NOT NULL,
    passcode varchar(6)
);

CREATE TABLE Enrollments (
    enrollmentId int auto_increment PRIMARY KEY,
    sectionId int REFERENCES Sections(sectionId),
    email varchar(50) REFERENCES Users(email)
);

CREATE TABLE CourseTopics (
    topicId int auto_increment PRIMARY KEY,
    sectionId int REFERENCES Sections(sectionId),
    topicName varchar(50) NOT NULL,
    topicDescription varchar(100),
    visible boolean NOT NULL
);

CREATE TABLE Resources (
    resourceId int auto_increment PRIMARY KEY,
    topicId int REFERENCES CourseTopics(topicId),
    resourceName varchar(50) NOT NULL,
    resourceType ENUM('problem', 'video', 'file') NOT NULL,
    resourceLocation varchar(50) NOT NULL,
    visible boolean NOT NULL
);