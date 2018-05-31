$(document).ready(function () {
    $.ajax({
        dataType: "json",
        url: "/topics",
        async: false,
        success: function (data) {
            populateTopics(data);
        }
    });
});

var populateTopics = function (topics) {
    var topicNum = 0;
    topics.forEach(topic => {
        $('#topic-list').before(
            '<div class="card"><div class="card-header" id="heading1"><h5 class="mb-0"><button class="btn btn-link" '
            + 'data-toggle="collapse" data-target="#collapse1" aria-expanded="false" aria-controls="collapse1">'
            + topic.number + topic.name + '</button></h5></div><div id="topic"' + topicNum + '" /></div>'
        );

        $.ajax({
            dataType: "json",
            url: "/resources/" + topic.id,
            async: false,
            success: function (data) {
                populateSections(data, topic, topicNum);
            }
        });

        topicNum += 1;
    });
}

var populateSections = function (resources, topic, topicNum) {
    sections.forEach(section => {
        $('#topic' + topicNum).before(

        );
    });
}



/*
    <div id="collapse1" class="collapse" aria-labelledby="heading1" data-parent="#accordion">
        <div class="card-body">
            Topic Content
          <br>
                <a href="/student/Math 101-01/Topic 1/problem=Problem 1">Problem 1</a>
        </div>*/
