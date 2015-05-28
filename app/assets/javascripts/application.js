//= require 'libraries/websocket'
//= require 'application/timeline'

(function () {
  'use strict';

  var videoElement, timelineTimeout;
  videoElement = document.querySelector('.ui.video');

  websocket.connect('socket');

  document.addEventListener('websocket.message', function (event) {
    var detail = event.detail;

    if (detail.type === 'message') {
      timeline.showTimeline();
      timeline.addMessage(detail);

      clearTimeout(timelineTimeout);
      timelineTimeout = setTimeout(function() {
        timeline.hideTimeline();
      }, 30000);
    } else if (detail.type === 'delete') {
      timeline.removeMessage(detail.id);
    }  else if (detail.type === 'event') {
      var oldVideoId, iframeElement, regex;
      oldVideoId = videoElement.dataset.videoId;
      iframeElement = videoElement.querySelector('iframe');

      if (oldVideoId !== detail.video_id) {
        videoElement.dataset.videoId = detail.video_id;

        regex = new RegExp(oldVideoId, 'g');
        iframeElement.src = iframeElement.src.replace(regex, detail.video_id);
      }
    }
  });
}());