$(document).ready(function () {
    var section = $("#course-info").data("section");

    $.get('/topics/' + section, populateTopics);
});

var populateTopics = async function (topics) {
    for (topic of topics) {
        $('#topic-list').before(
            '<div class="card"><div class="card-header" id="topic' + topic.topicId + '"><h5 class="mb-0"><button class="btn btn-link" '
            + 'data-toggle="collapse" data-target="#collapse' + topic.topicId + '" aria-expanded="false" aria-controls="collapse1">'
            + topic.topicName + '</button></h5></div><div id="collapse' + topic.topicId + '" class="collapse" aria-labelledby="topic'
            + topic.topicId + '" data-parent="#accordion">'
            + '<div class="card-body">' + topic.topicDescription + '<div id="resource' + topic.topicId + '" /></div></div>'
        );

        await $.get('/resources/' + topic.topicId, function (data) {
            populateResources(data, topic.topicId);
        });
    }
}

var populateResources = function (resources, topic) {
    resources.forEach(resource => {
        $('#resource' + topic).before(
            '<br><a href="/student/resource/' + resource.resourceId + '">' + resource.resourceName + '</a><div id="resource' + topic + '" />'
        );
    });
}