DROP TABLE IF EXISTS Resources;
DROP TABLE IF EXISTS CourseTopics;
DROP TABLE IF EXISTS ResourceTypes;
DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS Sections;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id int AUTO_INCREMENT NOT NULL,
    email varchar(50) NOT NULL,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    passwd varchar(60) NOT NULL,
    privilegeLevel ENUM('admin', 'teacher', 'student') NOT NULL
);

CREATE TABLE Courses (
    courseID int auto_increment PRIMARY KEY,
    courseName varchar(50) NOT NULL,
    owner varchar(50) REFERENCES Users(email)
);

CREATE TABLE Sections (
    sectionID int auto_increment PRIMARY KEY,
    courseID int REFERENCES Courses(courseID),
    owner varchar(50) REFERENCES Users(email),
    sectionNumber int NOT NULL
);

CREATE TABLE Enrollments (
    enrollmentID int auto_increment PRIMARY KEY,
    sectionID int REFERENCES Sections(sectionID),
    email varchar(50) REFERENCES Users(email)
);

CREATE TABLE CourseTopics (
    topicID int auto_increment PRIMARY KEY,
    sectionID int REFERENCES Sections(sectionID),
    topicNumber int NOT NULL,
    topicName varchar(50) NOT NULL,
    topicDescription varchar(50),
    visible boolean NOT NULL
);

CREATE TABLE ResourceTypes (
    resourceTypeID int auto_increment PRIMARY KEY,
    typeName varchar(50) NOT NULL,
    typeDescription varchar(50),
    executableLocation varchar(50) NOT NULL
);

CREATE TABLE Resources (
    resourceID int auto_increment PRIMARY KEY,
    topicID int REFERENCES CourseTopics(topicID),
    resourceName varchar(50) NOT NULL,
    resourceTypeID int REFERENCES ResourceTypes(resourceTypeID),
    resourceNumber int NOT NULL,
    fileLocation varchar(50) NOT NULL,
    visible boolean NOT NULL
);