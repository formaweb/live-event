//= require 'libraries/websocket'
//= require 'application/timeline'

(function() {
  var videoElement = document.querySelector('.ui.video'),
      timelineTimeout,
      ajaxFallback = false,
      ajaxInterval,
      lastTimestamp;

  function parseMessage(data) {
    // Type: Message
    if (data.type === 'message') {
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

  function getUsingAjax() {
    var request = new XMLHttpRequest();

    request.open('GET', '/messages.json?last_timestamp=' + (lastTimestamp || ''), true);
    request.setRequestHeader('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));

    request.onload = function() {
      var response = JSON.parse(request.responseText);
      lastTimestamp = response.timestamp;

      response.detail.forEach(function(data) {
        parseMessage(data);
      });
    };

    request.send();
  }

  // Usage
  websocket.connect('socket');

  document.addEventListener('websocket.error', function(event) {
    if (!ajaxFallback) {
      ajaxFallback = true;

      getUsingAjax();
      ajaxInterval = setInterval(getUsingAjax, 1000);
    }
  });

  document.addEventListener('websocket.status', function(event) {
    var status = event.detail.status;

    if (status) {
      ajaxFallback = false;
      clearInterval(ajaxInterval);
    }
  });

  document.addEventListener('websocket.message', function(event) {
    var detail = event.detail;
    parseMessage(detail);
  });
}());
