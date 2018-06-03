$(document).ready(function () {
    toggleFields();
    var section = $("#course-info").data("section");

    $.get('/topics/' + section, populateTopics);

    $("#addTopicButton").on('click', function () {
        $("#addTopicForm").submit();
    });

    $("#selectField").change(function() {
      toggleFields();
    });
});

function toggleFields() {
  if ($("#selectField").val() === "Video"){
      $("#videoField").show();
      $("#fileField").hide();
      $("#problemType").hide();
  }
  else if ($("#selectField").val() === "Problem") {
    $("#videoField").hide();
    $("#fileField").hide();
    $("#problemType").show();
  }
  else {
      $("#videoField").hide();
      $("#problemType").hide();
      $("#fileField").show();
  }
}

var populateTopics = async function (topics) {
    for (topic of topics) {
        $('#topic-list').before(
            '<div class="card"><div class="card-header" id="topic' + topic.topicId + '"><h5 class="mb-0"><button class="btn btn-link" '
            + 'data-toggle="collapse" data-target="#collapse' + topic.topicId + '" aria-expanded="false" aria-controls="collapse1">'
            + topic.topicName + '</button><button class="btn btn-link text-danger delete-topic" data-topic-id="'+ topic.topicId + '"data-toggle="modal" data-target="#deleteTopicModal"'
            + '>Delete Topic</button>'
            + '</h5></div><div id="collapse' + topic.topicId + '" class="collapse" aria-labelledby="topic'
            + topic.topicId + '" data-parent="#accordion">'
            + '<div class="card-body">' + topic.topicDescription + '<div id="resource' + topic.topicId + '" />'
            + '<button class="btn btn-link add-resource" data-topic-id="'+ topic.topicId + '"data-toggle="modal" data-target="#addResourceModal">Add Resource</button></div></div>'
        );

        await $.get('/resources/' + topic.topicId, function (data) {
            populateResources(data, topic.topicId);
        });
        
        $(".delete-topic").on("click", function() {
          $("#deleteTopicHidden").val($(this).data("topic-id"));
        })

        $(".add-resource").on("click", function() {
          $("#addResourceHidden").val($(this).data("topic-id"));
        })
    }
    $("#addResourceButton").on('click', function () {
      $("#addResourceForm").submit();
  });

}

var populateResources = function (resources, topic) {
    resources.forEach(resource => {
        $('#resource' + topic).before(
            '<br><a href="/teacher/resource/' + resource.resourceId + '">' + resource.resourceName + '</a><div id="resource' + topic + '" />'
        );
    });
}