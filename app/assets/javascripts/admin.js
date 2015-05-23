//= require jquery
//= require jquery_ujs
//= require websocket

$(document).ready(function(){
  var websocket = window.Formaweb.Websocket();
  var user_id;
  
  user_id = $('body').attr('data-user-id');
  
  /* Init websocket connection */
  websocket.init('admin/socket');
  
  /* Message from server handler */
  $(document).on('message', function(e, data){
    
    switch(data.type) {
      
      /* New tweet */
      case 'tweet':
        console.log('tweet', data);
        break;
      
      /* New image */
      case 'image':
        console.log('image', data);
        break;
      
      /* Event configuration changed */
      case 'event':
        $('#video_url').val(data.video_url);
        $('#event_name').val(data.event_name);
        console.log('event', data);
        break;
      
      /* New message */
      case 'message':
        // Remove typing if user was typing
        if($('.messages .typing#'+data.user_id).length > 0) $('.messages .typing#'+data.user_id).remove();
        // Show the message
        $('.messages').append('<div class="message" id="message_'+data.id+'"><img src="'+data.user_photo+'" width="20" style="border-radius: 100%;"> '+data.user_name+': '+data.message+(data.user_id == user_id ? ' <a href="#" class="delete-message" data-id="'+data.id+'">apagar</a>' : '')+'</div>');
        break;
      
      /* User is typing */
      case 'typing':
        if(data.user_id == user_id) return;
        
        if($('.messages .typing#'+data.user_id).length > 0){
          if(data.message.length == 0) {
            $('.messages .typing#'+data.user_id).remove();
          } else {
            $('.messages .typing#'+data.user_id+' .content').html(data.message);
          }
        } else {
          if(data.message.length > 0) {
            $('.messages').append('<div class="typing" id="'+data.user_id+'">'+data.user_name+' está digitando: <span class="content">'+data.message+'</div></div>');
          }
        }
        break;
      
      /* Delete message */
      case 'delete':
        if($('.message#message_'+data.id).length > 0) $('.message#message_'+data.id).remove();
        console.log('delete', data);
        break;
      
      /* Erro on response */
      case 'error':
        if(user_id == data.user_id) alert(data.errors);
        break;
    }
  });
  
  /* Delete a message */
  $(document).on('click', '.delete-message', function(){
    if(confirm('Tem certeza que deseja apagar essa bela mensagem?')){
      websocket.send({
        id: $(this).attr('data-id'),
        type: 'delete'
      });
    }
    
    return false;
  });
  
  /* Send to server typing option */
  $('#typing').on('change', function(){
    websocket.send({
      message: ($(this).is(':checked') ? $('#message').val() : ''),
      type: 'typing'
    });
  });
  
  /* Seng typing data to server */
  $('textarea#message').on('keyup', function(e){
    if(e.keyCode == 13){
      $('#message_form').submit();
      return false;
    }
    
    if($('#typing').is(':checked')){
      websocket.send({
        message: $('#message').val(),
        type: 'typing'
      });
    }
    
  });
  
  /* Send message to server */
  $('#message_form').on('submit', function(){
    
    websocket.send({
      message: $('#message').val(),
      type: 'message'
    });
    
    $('#message').val('').focus();
    
    return false;
  });
  
  /* Send event configurations to server */
  $('#event_form').on('submit', function(){
    
    websocket.send({
      video_url: $('#video_url').val(),
      event_name: $('#event_name').val(),
      type: 'event'
    });
    
    return false;
  });
});