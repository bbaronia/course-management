//Wait until page loaded
$(document).ready(function () {
    //Grab section number off HTML
    var section = $("#course-info").data("section");

    //Grab topics from server
    $.get('/topics/' + section, populateTopics);
});

//Insert topics
var populateTopics = async function (topics) {
    for (topic of topics) {
        //For each topic, insert following html
        $('#topic-list').before(
            '<div class="card"><div class="card-header" id="topic' + topic.topicId
            + '"><h5 class="mb-0"><button class="btn btn-link" '
            + 'data-toggle="collapse" data-target="#collapse' + topic.topicId
            + '" aria-expanded="false" aria-controls="collapse1">'
            + topic.topicName + '</button></h5></div><div id="collapse'
            + topic.topicId + '" class="collapse" aria-labelledby="topic'
            + topic.topicId + '" data-parent="#accordion">'
            + '<div class="card-body">' + topic.topicDescription
            + '<div id="resource' + topic.topicId + '" /></div></div>'
        );

        //Make sure we don't move on to next topic before inserting resources
        //Grap resources from server
        await $.get('/resources/' + topic.topicId, function (data) {
            populateResources(data, topic.topicId);
        });
    }
}

//Insert resources
var populateResources = function (resources, topic) {
    resources.forEach(resource => {
        //For each resource, insert following code
        $('#resource' + topic).before(
            '<div class="row"><div class="col-12"><a class="btn btn-link"'
            + ' href="/resource/' + resource.resourceId + '">'
            + resource.resourceName + '</a></div></div><div id="resource'
            + topic + '" />'
        );
    });
}