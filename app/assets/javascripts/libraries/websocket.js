var websocket = (function() {
  'use strict';

  //--- Private Methods ---//
  var socket;

  //--- Public Methods ---//
  function connect(path) {
    socket = new WebSocket((location.protocol == 'https:' ? 'wss:' : 'ws:') + '//' + location.host + '/' + path);

    socket.onopen = function() {
      var event = new CustomEvent('websocket.status', { detail: { status: true } });
      document.dispatchEvent(event);
      console.info('Connection started.');
    };

    socket.onclose = function() {
      var event = new CustomEvent('websocket.status', { detail: { status: false } });
      document.dispatchEvent(event);
      console.info('Connection closed.');

      setTimeout(function() {
        connect(path);
        console.log('Reconnecting...');
      }, 10000);
    };

    socket.onerror = function() {
      var event = new CustomEvent('websocket.error');
      document.dispatchEvent(event);
      console.info('Connection error.');
    };

    socket.onmessage = function(response) {
      var detail, event;
      detail = JSON.parse(response.data);
      event = new CustomEvent('websocket.message', { detail: detail });
      document.dispatchEvent(event);
    };
  }

  function send(data) {
    socket.send(JSON.stringify(data));
  }

  //--- Public Methods ---//
  return {
    connect: connect,
    send: send
  };
}());
