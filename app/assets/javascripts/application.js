//= require 'libraries/websocket'
//= require 'application/timeline'

(function() {
  var videoElement = document.querySelector('.ui.video'),
      timelineTimeout;

  websocket.connect('socket');

  function parseMessage(data) {
    // Type: Message
    if (data.type === 'message') {
      timeline.showTimeline();
      timeline.addMessage(data);

      clearTimeout(timelineTimeout);
      timelineTimeout = setTimeout(function() {
        timeline.hideTimeline();
      }, 30000);

    // Type: Delete
    } else if (data.type === 'delete') {
      timeline.removeMessage(data.id);

    // Type: Event
    } else if (data.type === 'event') {
      var oldVideoId = videoElement.dataset.videoId;
      var iframeElement = videoElement.querySelector('iframe');

      if (oldVideoId !== data.video_id) {
        var regex = new RegExp(oldVideoId, 'g');
        videoElement.dataset.videoId = data.video_id;
        iframeElement.src = iframeElement.src.replace(regex, data.video_id);
      }
    }
  }

  document.addEventListener('websocket.message', function(event) {
    var detail = event.detail;
    parseMessage(detail);
  });
}());
