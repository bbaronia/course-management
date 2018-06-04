$(document).ready(function () {
    $.get('/courses', populateCourses);

    $("#addSectionButton").on("click", function() {
        $("#addSectionForm").submit();
    });

    $("#addSectionForm").validate({
        rules: {
          sectionId: {
            required: true,
            digits: true
          },
          passcode: {
            required: false,
            digits: true,
            minlength: 4,
            maxlength: 6
          }
        },
        messages: {
          sectionId: {
            required: "Please enter a section number",
            digits: "The section number must be a number"
          },
          passcode: {
            digits: "The section passcode must be numeric",
            minlength: "The section passcode must be at least 4 digits long",
            maxlength: "The section passcode cannot be longer than 6 digits"
          }
        }
      });
});

var populateCourses = function (courses) {
    courses.forEach(course => {
        $.get("/sections/" + course.courseId, function (data) {
            populateSections(data, course);
        });
    });
}

var populateSections = function (sections, course) {
    sections.forEach(section => {
        $('#course-list').before(
            '<div class="row border-bottom"><div class="col-2"><div class='
            + '"media-heading"><a href="/section/' + section.sectionId
            + '">' + course.courseName + '-' + section.sectionId
            + '</a></div></div><div class="col-2 media-body">' + section.quarter
            + ' ' + section.year + '</div><div class="col-6 media-body">'
            + section.description + '</div></div>'
        );
    });
}
