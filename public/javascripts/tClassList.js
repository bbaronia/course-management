$(document).ready(function() {
    var courses = ['Math 101', 'Math 201', 'Math 301'];
    var courseNum = 0;
    courses.forEach(course => {
        var sections = [{ number: 1, description: 'description', quarter: 'Spring 2018'}, {number: 2, description: 'description', quarter: 'Spring 2019'}];
        var sectionNum = 0;
        courseNumText = courseNum + 1;
        $('#course-list-' + courseNum).after(
            '<div class="row"><div class="col-2"><div class="media-heading">' + course + '</div></div>' + '<div id="' + courseNum + '-0" />'
            + '<div class="section-modal" /></div><div id="course-list-' + courseNumText + '" />'
        );


        sections.forEach(section => {
            sectionNumText = sectionNum + 1;
            $('#' + courseNum + '-' + sectionNum).after(
                '<div class="col-10"><a href="/teacher/' + course + '-' + section.number + '"><div class="row"><div class="col-2 media-body">'
                + 'Section ' + section.number + '</div><div class="col-2 media-body">' + section.quarter + '</div><div class="col-8 media-body">'
                + section.description + '</div></div></a></div><div class="w-100" /><div class="col-2" /><div id="' + courseNum + '-' + sectionNumText + '" />'
            );
            sectionNum += 1;
        });
        courseNum += 1;
    });

    $('.section-modal').load('addSectionModal.html');
});