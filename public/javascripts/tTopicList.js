$(document).ready(function () {
    var section = $("#course-info").data("section");

    $.get('/topics/' + section, populateTopics);
});

var populateTopics = async function (topics) {
    var topicNum = 0;
    for (topic of topics) {
        $('#topic-list').before(
            '<div class="card"><div class="card-header" id="topic' + topicNum + '"><h5 class="mb-0"><button class="btn btn-link" '
            + 'data-toggle="collapse" data-target="#collapse' + topicNum + '" aria-expanded="false" aria-controls="collapse1">'
            + topic.number + ' ' + topic.name + '</button></h5></div><div id="collapse' + topicNum + '" class="collapse" aria-labelledby="topic'
            + topicNum + '" data-parent="#accordion">'
            + '<div class="card-body">' + topic.text + '<div id="resource' + topicNum + '" /></div></div>'
        );

        await $.get('/resources/' + topic.id, function (data) {
            populateResources(data, topic, topicNum);
        });
        //$.ajax({
        //    dataType: "json",
        //    url: "/resources/" + topic.id,
        //    async: false,
        //    success: function (data) {
        //        populateResources(data, topic, topicNum);
        //    }
        //});

        topicNum += 1;
    }
}

var populateResources = function (resources, topic, topicNum) {
    resources.forEach(resource => {
        $('#resource' + topicNum).before(
            '<br><a href="/student/resource/' + resource.id + '">' + resource.name + '</a><div id="resource' + topicNum + '" />'
        );
    });
}