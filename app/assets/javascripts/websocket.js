window.Formaweb = window.Formaweb || {};

window.Formaweb.Websocket = function() {
  var wsocket;
  
  var connection = function(streaming_path){
    wsocket = new WebSocket('ws://' + window.location.host + '/'+streaming_path);
    
    wsocket.onopen = function(){
      $(document).trigger('connection', {status: true});
      console.log('Connection started.');
    };

    wsocket.onclose = function(){
      $(document).trigger('connection', {status: false});
      console.log('Connection closed.');
      setTimeout(function(){
        console.log('Reconnecting...');
        connection(streaming_path);
      }, 1000);
    };

    wsocket.onmessage = function (event) {
      var data = JSON.parse(event.data);
      
      $(document).trigger('message', data);
    }
  };
  
  return {
    init: function(streaming_path){
      connection(streaming_path);
    },
    send: function(data){
      wsocket.send(JSON.stringify(data));
    }
  }
  
}