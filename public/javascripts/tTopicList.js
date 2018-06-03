$(document).ready(function () {
    var section = $("#course-info").data("section");

    $.get('/topics/' + section, populateTopics);

    $("#addTopicButton").on('click', function () {
        $("#addTopicForm").submit();
    });
});

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
            + '<a href="/addResource/topicId">Add Resource</a></div></div>'
        );

        await $.get('/resources/' + topic.topicId, function (data) {
            populateResources(data, topic.topicId);
        });
        
        $(".delete-topic").on("click", function() {
          $("#deleteTopicHidden").val($(this).data("topic-id"));
        })
    }


}

var populateResources = function (resources, topic) {
    resources.forEach(resource => {
        $('#resource' + topic).before(
            '<br><a href="/teacher/resource/' + resource.resourceId + '">' + resource.resourceName + '</a><div id="resource' + topic + '" />'
        );
    });
}

{/* <div class="card">
<div class="card-header" id="heading1">
  <h5 class="mb-0">
    <button class="btn btn-link" data-toggle="collapse" data-target="#collapse1" aria-expanded="false" aria-controls="collapse1">
      Topic 1
    </button>
    <button class="btn btn-link text-danger" data-toggle="modal" data-target="#deleteTopicModal">Delete Topic</button>
    <div class="modal fade" id="deleteTopicModal" tabindex="-1" role="dialog" aria-labelledby="deleteTopicTitle" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteTopicTitle">Delete Topic</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this topic?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <form action="/deleteTopic" method="POST">
              <input type="hidden" name="topicId" value="1" />
              <button type="submit" class="btn btn-primary">Delete Topic</button>
              </form>
          </div>
        </div>
      </div>
    </div>
  </h5>
</div>

<div id="collapse1" class="collapse" aria-labelledby="heading1" data-parent="#accordion">
  <div class="card-body">
    Topic Content
    <a href="/addResource/topicId">Add Resource</a>
  </div>
</div>
</div> */}