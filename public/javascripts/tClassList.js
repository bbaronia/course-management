$(document).ready(function () {
    $.ajax({
        dataType: "json",
        url: "/courses",
        async: false,
        success: function (data) {
            populateCourses(data);
        }
    });


    $("#createSectionButton").on('click', function () {
        $("#createSectionForm").submit();
    });
});

var populateCourses = function (courses) {
    var courseNum = 0;
    courses.forEach(course => {
        $('#course-list').before(
            '<div class="row border-bottom"><div class="col-2"><div class="media-heading">' + course.name + '</div></div>' + '<div id="course' + courseNum + '" />'
            + '</div><div id="course-list" />'
        );

        $('#class-list').append($('<option>', {
            value: course.id,
            text: course.name
        }));

        $.ajax({
            dataType: "json",
            url: "/sections/" + course.name,
            async: false,
            success: function (data) {
                populateSections(data, course.id, courseNum);
            }
        });

        courseNum += 1;
    });
}

var populateSections = function (sections, course, courseNum) {
    sections.forEach(section => {
        $('#course' + courseNum).before(
            '<div class="col-10"><a href="/teacher/' + course + '-' + section.id + '"><div class="row"><div class="col-2 media-body">'
            + 'Section ' + section.number + '</div><div class="col-2 media-body">' + section.quarter + ' ' + section.year
            +  '</div><div class="col-6 media-body">' + section.description + '</div><div class="col-2 media-body">Section ID '
            + section.id + '</div></div></a></div><div class="w-100" /><div class="col-2" /><div id="course' + (courseNum) + '" />'
        );
    });
}