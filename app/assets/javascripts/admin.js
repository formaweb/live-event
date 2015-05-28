//= require 'libraries/websocket'
//= require 'admin/settings'
//= require 'admin/timeline'

(function () {
  'use strict';

  var i, userId, formsElements;
  userId = document.body.dataset.userId;
  
  window.onload = function () {
    timeline.scrollDown();
  }

  //--- Confirmation ---//
  document.addEventListener('click', function (event) {
    var self = event.target;

    if (self.matches('[data-confirm]')) {
      event.stopPropagation();
      return confirm(self.dataset.confirm);
    }
  });


  //-----------------//
  //    WebSocket    //
  //-----------------//
  websocket.connect('admin/socket');
  
  document.addEventListener('websocket.status', function (event) {
    if(event.detail.status){
      document.querySelector('.connection-status').style.backgroundColor = 'green';
    } else {
      document.querySelector('.connection-status').style.backgroundColor = 'red';
    }
  });

  //--- Message Listener ---//
  document.addEventListener('websocket.message', function (event) {
    var detail, type;
    detail = event.detail;
    type = detail.type

    if (type === 'message') {
      timeline.addMessage(detail, userId);
      timeline.updateUserMessage(detail.user_id, '');
    } else if (type === 'delete') {
      timeline.removeMessage(detail.id);
    } else if (type === 'typing') {
      timeline.updateUserMessage(detail.user_id, detail.message);
    } else if (type === 'user') { 
      if (document.querySelector('.js-user-' + detail.user_id) != undefined) {
        if (!detail.online) { timeline.removeUser(detail.user_id); }
      } else {
        if (detail.online) { timeline.addUser(detail); }
      }
    } else if (type === 'event') {
      setTimeout(function(){
        settings.updateName(detail.event_name);
        settings.updateVideo(detail.video_id, detail.video_url);
      }, 1000);
    } else if (type === 'error' && userId === detail.user_id) {
      console.error(detail.errors);
    }
  });

  //--- Delete Message ---//
  document.addEventListener('click', function (event) {
    var self, request;
    self = event.target;

    if (self.matches('.delete-message')) {
      request = new XMLHttpRequest();

      event.preventDefault();

      request.open('DELETE', '/admin/messages/'+self.dataset.messageId, true);
      request.setRequestHeader('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));

      request.send();
    }

    return false;
  });

  //--- Typing Toggle ---//
  typing.addEventListener('change', function (event) {
    websocket.send({
      message: (this.checked ? message.value : ''),
      type: 'typing'
    });
  });

  //--- Typing Data ---//
  message.addEventListener('keyup', function (event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      sendFormData.call(document.querySelector('.send.form'), event);
      event.stopPropagation();
      return false;
    }

    if (typing.checked) {
      websocket.send({
        message: this.value,
        type: 'typing'
      });
    }
  });

  //--- Sending Form Data ---//
  function sendFormData(event) {
    var self, request, submitButtonElement;

    self = this;
    request = new XMLHttpRequest();
    submitButtonElement = self.querySelector('[type="submit"]');

    event.preventDefault();
    submitButtonElement.disabled = true;

    request.open('POST', this.action, true);
    request.setRequestHeader('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));

    request.onload = function () {
      message.focus();
      submitButtonElement.disabled = false;
      self.reset();
    };

    request.send(new FormData(this));

    return false;
  }

  formsElements = document.getElementsByTagName('form');
  for (i = 0; i < formsElements.length; i++) {
    formsElements[i].addEventListener('submit', sendFormData);
  }
}());