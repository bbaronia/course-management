$(document).ready(function () {
    $.get('/courses', populateCourses)

    $("#createSectionButton").on('click', function () {
        $("#createSectionForm").submit();
    });
});

var populateCourses = async function(courses) {
    var courseNum = 0;

    for (course of courses) {
        $('#course-list').before(
            '<div class="row border-bottom"><div class="col-2"><div class='
            + '"media-heading">' + course.name + '</div></div>' + '<div id='
            + '"course' + courseNum + '" /></div><div id="course-list" />'
        );

        $('#class-list').append($('<option>', {
            value: course.id,
            text: course.name
        }));

        //Section population relies on course, so make sure we await get call
        await $.get('/sections/' + course.id, function(data) {
            populateSections(data, course.id, courseNum);
        });


        courseNum += 1;
    }
}

var populateSections = function (sections, course, courseNum) {
    sections.forEach(section => {
        $('#course' + courseNum).before(
            '<div class="col-10"><a href="/teacher/' + course + '-' + section.id
            + '"><div class="row"><div class="col-2 media-body">Section '
            + section.number + '</div><div class="col-2 media-body">'
            + section.quarter + ' ' + section.year +  '</div><div class="col-6'
            + ' media-body">' + section.description + '</div><div class="col-2'
            + ' media-body">Section ID ' + section.id + '</div></div></a></div>'
            + '<div class="w-100" /><div class="col-2" /><div id="course'
            + courseNum + '" />'
        );
    });
}