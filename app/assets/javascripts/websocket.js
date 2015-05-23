window.Formaweb = window.Formaweb || {};

window.Formaweb.Websocket = function() {
  var wsocket;
  
  return {
    init: function(streaming_path){
      wsocket = new WebSocket('ws://' + window.location.host + '/'+streaming_path);
      
      wsocket.onopen = function(){ 
        console.log('Connection started.');
      };

      wsocket.onclose = function(){
        console.log('Connection closed.');
      };

      wsocket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        
        $(document).trigger('message', data);
      }
    },
    send: function(data){
      wsocket.send(JSON.stringify(data));
    }
  }
  
}