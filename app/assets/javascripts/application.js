//= require jquery
//= require websocket

(function () {
  'use strict';

  /* Init websocket connection */
  websocket.init('socket');
  
  /* Connection handler */
  $(document).on('connection', function(e, data){
    $('body').css('background-color', (data.status ? 'green' : 'red'));
  });
}());