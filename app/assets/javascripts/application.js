//= require 'libraries/websocket'
//= require 'application/timeline'

(function() {
  console.warn('Habilite o "autoplay" em chrome://flags/#autoplay-policy.')

  var videoElement = document.querySelector('.ui.video'),
      navigatorElement = document.querySelector('.navigator'),
      timelineTimeout,
      ajaxFallback = false,
      ajaxInterval,
      lastTimestamp;

  function videoControl(command) {
    var iframeElement = videoElement.querySelector('.youtube');
    command = command ? 'playVideo' : 'pauseVideo';

    iframeElement.contentWindow.postMessage('{"event":"command","func":"' + command + '","args":""}', '*');
  }

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
      var oldVideoUrl = videoElement.dataset.videoUrl;

      if (oldVideoUrl == data.video_url) {
        return;
      }

      videoElement.dataset.videoId = data.video_id;
      videoElement.dataset.videoUrl = data.video_url;

      if (!data.video_id) {
        navigatorElement.src = data.video_url;
        navigatorElement.classList.add('show');

        return videoControl(false);
      }

      navigatorElement.classList.remove('show');

      var iframeElement = videoElement.querySelector('.youtube');
      iframeElement.src = '//www.youtube.com/embed/' + data.video_id + '?playlist=' + data.video_id + '&autoplay=1&controls=2&showinfo=0&rel=0&enablejsapi=1';

      videoControl(true);
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
      ajaxInterval = setInterval(getUsingAjax, 5000);
    }
  });

  document.addEventListener('websocket.status', function(event) {
    if (event.detail.status) {
      ajaxFallback = false;
      clearInterval(ajaxInterval);
    }
  });

  document.addEventListener('websocket.message', function(event) {
    var detail = event.detail;
    parseMessage(detail);
  });
}());
