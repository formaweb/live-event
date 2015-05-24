//= require 'components/websocket'
//= require 'components/timeline'

(function () {
  'use strict';

  websocket.connect('socket');

  document.addEventListener('websocket.message', function (event) {
    var detail = event.detail;

    if (detail.type === 'message') {
      timeline.addMessage(detail);
    } else if (detail.type === 'delete') {
      timeline.removeMessage(detail.id);
    }
  });
}());