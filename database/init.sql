DROP TABLE IF EXISTS Resources;
DROP TABLE IF EXISTS TopicMap;
DROP TABLE IF EXISTS Topics;
DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS Sections;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    email varchar(50) NOT NULL UNIQUE,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    passwd varchar(60) NOT NULL,
    privilegeLevel ENUM('teacher', 'student') NOT NULL
);

CREATE TABLE Courses (
    courseId int auto_increment PRIMARY KEY,
    courseName varchar(50) NOT NULL,
    owner varchar(50),
    FOREIGN KEY (owner) REFERENCES Users(email) ON DELETE CASCADE
);

CREATE TABLE Sections (
    sectionId int auto_increment PRIMARY KEY,
    courseId int,
    description varchar(100) NOT NULL,
    quarter ENUM('Spring', 'Summer', 'Fall', 'Winter') NOT NULL,
    year int NOT NULL,
    passcode varchar(6),
    FOREIGN KEY (courseId) REFERENCES Courses(courseId) ON DELETE CASCADE
);

CREATE TABLE Enrollments (
    enrollmentId int auto_increment PRIMARY KEY,
    sectionId int,
    email varchar(50),
    FOREIGN KEY (sectionId) REFERENCES Sections(sectionId) ON DELETE CASCADE,
    FOREIGN KEY (email) REFERENCES Users(email) ON DELETE CASCADE
);

CREATE TABLE Topics (
    topicId int auto_increment PRIMARY KEY,
    sectionId int,
    topicName varchar(50) NOT NULL,
    topicDescription varchar(100),
    visible boolean NOT NULL,
    FOREIGN KEY (sectionId) REFERENCES Sections(sectionId) ON DELETE CASCADE
);

CREATE TABLE TopicMap (
    mapId int auto_increment PRIMARY KEY,
    sectionId int,
    topicId int,
    FOREIGN KEY (sectionId) REFERENCES Sections(sectionId) ON DELETE CASCADE,
    FOREIGN KEY (topicId) REFERENCES Topics(topicId) ON DELETE CASCADE
);

CREATE TABLE Resources (
    resourceId int auto_increment PRIMARY KEY,
    topicId int,
    resourceName varchar(50) NOT NULL,
    resourceType ENUM('problem', 'video', 'file') NOT NULL,
    resourceLocation varchar(100) NOT NULL,
    visible boolean NOT NULL,
    FOREIGN KEY (topicId) REFERENCES Topics(topicId) ON DELETE CASCADE
);
