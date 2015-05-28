//= require jquery
//= require jquery_ujs
//= require websocket

$(document).ready(function(){
  var websocket = window.Formaweb.Websocket();
  var user_id;
  
  user_id = $('body').attr('data-user-id');
  
  /* Init websocket connection */
  websocket.init('admin/socket');
  
  /* Connection handler */
  $(document).on('connection', function(e, data){
    $('.connection').css('background-color', (data.status ? 'green' : 'red'));
  });
  
  /* Message from server handler */
  $(document).on('message', function(e, data){
    
    console.log('message', data);
    
    switch(data.type) {
      
      /* New tweet */
      case 'tweet':
        console.log('tweet', data);
        break;
      
      /* User activity */
      case 'user':
        if($('.users .user.user_'+data.user_id).length > 0){
          if(!data.online) $('.users .user.user_'+data.user_id).remove();
        } else {
          $('.collection.users').append('<div class="user user_'+data.user_id+'"><div class="meta">'+data.user_name+'</div><div class="content away">Nenhuma atividade identificada.</div></div>');
        }
        break;
      
      /* Event configuration changed */
      case 'event':
        $('#video_url').val(data.video_url).attr('value', data.video_url);
        $('#event_name').val(data.event_name).attr('value', data.event_name);
        $('.brand').text(data.event_name);
        if(data.video_url == ''){
          $('.video').html('').attr('data-video-id', '');
        } else {
          if($('.video').attr('data-video-id') != data.video_id){
            $('.video').html('<iframe width="560" height="315" src="https://www.youtube.com/embed/'+data.video_id+'" frameborder="0" allowfullscreen></iframe>').attr('data-video-id', data.video_id);
          }
        }
        break;
      
      /* New message */
      case 'message':
        // Remove typing if user was typing
        if($('.messages .typing#'+data.user_id).length > 0) $('.messages .typing#'+data.user_id).remove();
        // Show the message
        $('.messages').append('<div class="message" id="message_'+data.id+'"><img src="'+data.user_photo+'" width="20" style="border-radius: 100%;"> '+data.user_name+': '+data.message+(data.image != '' ? ' <img src="'+data.image+'" height="300">' : '')+(data.user_id == user_id ? ' <a href="#" class="delete-message" data-id="'+data.id+'">apagar</a>' : '')+'</div>');
        break;
      
      /* User is typing */
      case 'typing':
        if(data.user_id == user_id) return;
        
        if($('.users .user.user_'+data.user_id).length > 0){
          if(data.message.length == 0) {
            $('.users .user.user_'+data.user_id+' .content').text('Nenhuma atividade identificada.');
          } else {
            $('.users .user.user_'+data.user_id+' .content').html('<strong>Esta digitando:</strong> '+data.message);
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
  
  /* Send form to server */
  $('form').on('submit', function(){
    var form = $(this);
    var form_data = form.serialize();
    var submit_button = form.find('button');
    
    $.ajax({
      url: form.attr('action'),
      method: 'post',
      dataType: 'json',
      data: new FormData(this),
      processData: false,
      contentType: false,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
        submit_button.attr('disabled');
      },
      success: function(data){
        submit_button.removeAttr('disabled');
        form[0].reset();
        $('#message').focus();
      }
    });
    
    return false;
  });
  
  /* Send event configurations to server */
  // $('#event_form').on('submit', function(){
  //
  //   websocket.send({
  //     video_url: $('#video_url').val(),
  //     event_name: $('#event_name').val(),
  //     type: 'event'
  //   });
  //
  //   return false;
  // });
});