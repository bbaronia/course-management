$(document).ready(function () {
    $.get('/courses', populateCourses);
});

var populateCourses = function (courses) {
    courses.forEach(course => {
        $.get("/sections/" + course.id, function (data) {
            populateSections(data, course);
        });
    });
}

var populateSections = function (sections, course) {
    sections.forEach(section => {
        $('#course-list').before(
            '<div class="row border-bottom"><div class="col-2"><div class='
            + '"media-heading"><a href="student/' + course.id + '-'
            + section.number + '">' + course.name + '-' + section.number
            + '</a></div></div><div class="col-2 media-body">' + section.quarter
            + ' ' + section.year + '</div><div class="col-2 media-body">'
            + section.teacher + '</div><div class="col-6 media-body">'
            + section.description + '</div></div>'
        );
    });
}
