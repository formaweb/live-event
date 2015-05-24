//= require 'components/websocket'
//= require 'components/timeline'

(function () {
  'use strict';

  websocket.connect('socket');

  document.addEventListener('websocket.message', function(event) {
    var detail = event.detail;

    if (['message'].indexOf(detail.type) != -1) {
      timeline.addMessage(detail);
    }
  });
}());