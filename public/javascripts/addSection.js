//When page is loaded
$(document).ready(function () {
    //Link button to form for submission
    $("#addSectionButton").on('click', function () {
        $("#addSectionForm").submit();
    });
});