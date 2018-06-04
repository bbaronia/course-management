$(document).ready(async function () {
    $.get('/courses', populateCourses);

    $("#createSectionButton").on("click", function () {
        $("#createSectionForm").submit();
    });

    $("#createCourseButton").on("click", function () {
        $("#createCourseForm").submit();
    });

    $("#createCourseForm").validate({
        rules: {
            courseName: {
                required: true,
                pattern: "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$",
                maxlength: 50
            },
        },
        messages: {
            courseName: {
                required: "Please enter a course name",
                pattern: "The course name can only contain letters, numbers, and spaces",
                maxlength: "The course name must be 50 characters or less"
            }
        }
    });

    $("#createSectionForm").validate({
        rules: {
            //courseName: {
            //  required: true,
            //  pattern: "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$"
            //},
            year: {
                required: true,
                digits: true,
                minlength: 4,
                maxlength: 4,
                min: 1970
            },
            description: {
                required: true,
                pattern: "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$",
                maxlength: 100
            },
            passcode: {
                required: "#passcodeEnabled:checked",
                digits: true,
                minlength: 4,
                maxlength: 6
            }
        },
        messages: {
            year: "Please enter a valid year",
            description: {
                required: "Please enter a description",
                pattern: "The description can only contain letters, numbers, and spaces",
                maxlength: "The description must be 100 characters or less"
            },
            passcode: {
                required: "Please add a passcode or disable",
                digits: "The passcode must be numeric",
                minlength: "The passcode must be at least 4 digits long",
                maxlength: "The passcode must be 6 digits or fewer"
            }
        }
    });
});


var populateCourses = async function (courses) {
    for (course of courses) {
        $('#course-list').before(
            '<div class="row"><div class="col-2"><div class='
            + '"media-heading">' + course.courseName + '</div></div>' + '<div id='
            + '"course' + course.courseId + '" /></div>'



            + '<div class="row"><div class="col-2"><button type="button" class="btn btn-outline-danger delete-course" data-course-id="' + course.courseId + '" data-toggle="modal" data-target="#deleteCourseModal">Delete Course</button></div>'
            + '<button type="button" class="btn btn-link add-section" data-course-id="' + course.courseId + '" data-course-name="' + course.courseName + '" data-toggle="modal" data-target="#addSectionModal">'
            + 'Add Section'
            + '</button>'
            + '</div><div class="row border-bottom"><div class="col-12 mb-1" /></div><div id="course-list" />'
        );

        $('#class-list').append($('<option>', {
            value: course.courseId,
            text: course.courseName
        }));

        //Section population relies on course, so make sure we await get call
        await $.get('/sections/' + course.courseId, function (data) {
            populateSections(data, course.courseId);
        });
    }

    //$('.add-section').each(function () {
    //    var $this = $(this);
    //    $this.on("click", function () {
    //        console.log($(this).data('course-name'));
    //    });
    //});
    $(".add-section").on("click", function () {
        $("#addSectionTitle").html('<h5 class="modal-title" id="addSectionTitle">Add ' + $(this).data("course-name") + ' Section</h5>');
        $("#addSectionHidden").val($(this).data("course-id"));
        //console.log($(this).data("course-name"));
        //console.log($(this).data("course-id"));
    });

    $(".delete-course").on("click", function () {
        $("#deleteCourseId").val($(this).data("course-id"));
    })
}

var populateSections = function (sections, course) {
    sections.forEach(section => {
        $('#course' + course).before(
            '<div class="col-10"><a href="/section/' + section.sectionId
            + '"><div class="row"><div class="col-2 media-body">Section '
            + section.sectionId + '</div><div class="col-2 media-body">'
            + section.quarter + ' ' + section.year + '</div><div class="col-4'
            + ' media-body">' + section.description + '</div><div class="col-2 media-body">'
            + passcodeEnabled(section.passcode) + '</div></div></a></div>'
            + '<div class="w-100" /><div class="col-2" /><div id="course'
            + course + '" />'
        );
    });
}

var passcodeEnabled = function(passcode) {
    if (passcode)
        return "Passcode: " + passcode
    else
        return ""
}