$(document).ready(function () {
    toggleFields();
    var section = $("#course-info").data("section");

    $.get('/topics/' + section, populateTopics);

    $("#addTopicButton").on('click', function () {
        $("#addTopicForm").submit();
    });

    $("#selectField").change(function () {
        toggleFields();
    });

    $("#addTopicForm").validate({
        rules: {
            topicName: {
                required: true,
                pattern: "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$",
                maxlength: 50
            },
            topicDescription: {
                required: true,
                pattern: "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$",
                maxlength: 100
            }
        },
        messages: {
            topicName: {
                required: "Please enter a topic name",
                pattern: "The topic name can only contain letters, numbers, and spaces",
                maxlength: "The topic name must be 50 characters or less"
            },
            topicDescription: {
                required: "Please enter a topic description",
                pattern: "The topic description can only contain letters, numbers, and spaces",
                maxlength: "The topic description must be 100 characters or less"
            }
        }
    });

    $("#addResourceForm").validate({
        rules: {
            resourceName: {
                required: true,
                pattern: "^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$",
                maxlength: 50
            },
            videoLocation: {
                required: function(element) {
                    return $("#selectField").val() === "video";
                  },
                  url: true
            },
            fileLocation: {
                required: function(element) {
                    return $("#selectField").val() === "file";
                  }
            }
        },
        messages: {
            courseName: {
                required: "Please enter a resource name",
                pattern: "The resource name can only contain letters, numbers, and spaces",
                maxlength: "The resource name must be 50 characters or less"
            },
            videoLocation: {
                required: "Please enter a video location",
                url: "The video location must be a URL"
            },
            fileLocation: {
                required: "Please upload a file"
            }
        }
    });
});

function toggleFields() {
    if ($("#selectField").val() === "video") {
        $("#videoField").show();
        $("#fileField").hide();
        $("#problemType").hide();
    }
    else if ($("#selectField").val() === "problem") {
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
var getButtonVal = function (visible, tag) {
    if (visible && !tag) {
        return "Hide From Students"
    }
    else if (!tag) {
        return "Show To Students"
    }
}


var populateTopics = async function (topics) {
    for (topic of topics) {
        $('#topic-list').before(
            '<div class="card"><div class="card-header" id="topic' + topic.topicId + '"><h5 class="mb-0"><button class="btn btn-link" '
            + 'data-toggle="collapse" data-target="#collapse' + topic.topicId + '" aria-expanded="false" aria-controls="collapse1">'
            + topic.topicName + '</button>'
            //+ '<form action="/hideTopic" type="POST">'
            //+ '<input type="hidden" value="' + topic.topicId + '" name="topicId">'
            //+ '<input type="hidden" value="' + topic.sectionId + '" name="sectionId">'
            //+ '</form>'
            + '<button class="btn btn-link text-danger delete-topic float-right" data-topic-id="' + topic.topicId + '"data-toggle="modal" data-target="#deleteTopicModal"'
            + '>Delete Topic</button>'
            + '<button class="btn float-right btn-link hide-topic" data-topic-id="' + topic.topicId
            + '">' + getButtonVal(topic.visible, false) + '</button>'
            + '</h5></div><div id="collapse' + topic.topicId + '" class="collapse" aria-labelledby="topic'
            + topic.topicId + '" data-parent="#accordion">'
            + '<div class="card-body">' + topic.topicDescription + '<div id="resource' + topic.topicId + '" />'
            + '<button class="btn btn-link add-resource" data-topic-id="' + topic.topicId + '"data-toggle="modal" data-target="#addResourceModal">Add Resource</button></div></div>'
        );

        await $.get('/resources/' + topic.topicId, function (data) {
            populateResources(data, topic.topicId);
        });

    }
    $("#addResourceButton").on('click', function () {
        $("#addResourceForm").submit();
    });
    $(".delete-topic").on("click", function () {
        $("#deleteTopicHidden").val($(this).data("topic-id"));
    })

    $(".add-resource").on("click", function () {
        $("#addResourceHidden").val($(this).data("topic-id"));
    })

    $(".hide-topic").on("click", function () {
        $this = $(this)
        $.ajax({
            url: "/hideTopic",
            type: "POST",
            dataType: 'json',
            data: { topicId: $this.data("topic-id"), method: $this.text() },
            success: function (data) {
                if (data.visible)
                    $this.html("Hide From Students")
                else
                    $this.html("Show To Students")
            }
        });
    });

}

var populateResources = function (resources, topic) {
    resources.forEach(resource => {
        $('#resource' + topic).before(
            '<div class="row border-bottom"><div class="col-8"><a class ="btn btn-link" href="/resource/' + resource.resourceId + '">' + resource.resourceName + '</a></div>'
            + '<div class="col-4"><button class="btn btn-link text-danger delete-resource float-right" data-resource-id="' + resource.resourceId + '"data-toggle="modal" data-target="#deleteResourceModal"'
            + '>Delete Topic</button>'
            + '<button class="btn float-right btn-link hide-resource" data-resource-id="' + resource.resourceId
            + '">' + getButtonVal(resource.visible, false) + '</button></div></div><div id="resource' + topic + '" />'
        );
    });

    $(".delete-resource").on("click", function () {
        $("#deleteResourceHidden").val($(this).data("resource-id"));
    })

    $(".hide-resource").on("click", function () {
        $this = $(this)
        $.ajax({
            url: "/hideResource",
            type: "POST",
            dataType: 'json',
            data: { resourceId: $this.data("resource-id"), method: $this.text() },
            success: function (data) {
                if (data.visible)
                    $this.html("Hide From Students")
                else
                    $this.html("Show To Students")
            }
        });
    });
}