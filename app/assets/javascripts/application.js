//= require jquery
//= require websocket

//= require 'components/timeline'

(function () {
  'use strict';

  var websocket = window.Formaweb.Websocket();
  /* Init websocket connection */
  websocket.init('socket');
  
  /* Connection handler */
  $(document).on('message', function(event, data) {
    timeline.addMessage(data);
  });
}());