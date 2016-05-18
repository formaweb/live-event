//= require 'libraries/websocket'
//= require 'admin/settings'
//= require 'admin/timeline'

(function () {
  'use strict';

  var i, formsElements;

  var userId = document.body.dataset.userId,
      ajaxFallback = false,
      ajaxInterval,
      lastTimestamp;

  function parseMessage(data) {
    var type = data.type;

    if (type === 'message') {
      timeline.addMessage(data, userId);
      timeline.updateUserMessage(data.user_id, '');
    } else if (type === 'delete') {
      timeline.removeMessage(data.id);
    } else if (type === 'typing') {
      timeline.updateUserMessage(data.user_id, data.message);
    } else if (type === 'user') {
      if (document.querySelector('.js-user-' + data.user_id) != undefined) {
        if (!data.online) { timeline.removeUser(data.user_id); }
      } else {
        if (data.online) { timeline.addUser(data); }
      }
    } else if (type === 'event') {
      setTimeout(function(){
        settings.updateName(data.event_name);
        settings.updateVideo(data.video_id, data.video_url);
      }, 1000);
    } else if (type === 'error' && userId === data.user_id) {
      console.error(data.errors);
    }
  };

  function getUsingAjax() {
    var request = new XMLHttpRequest();

    request.open('GET', '/messages.json?last_timestamp=' + (lastTimestamp || ''), true);
    request.setRequestHeader('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));

    request.onload = function() {
      var response = JSON.parse(request.responseText);
      lastTimestamp = response.timestamp;

      response.detail.forEach(function(data) {
        parseMessage(data);
      });
    };

    request.send();
  }

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

  document.addEventListener('websocket.status', function(event) {
    if (event.detail.status){
      ajaxFallback = false;
      clearInterval(ajaxInterval);
      document.querySelector('.connection-status').style.backgroundColor = 'green';
    } else {
      document.querySelector('.connection-status').style.backgroundColor = 'red';
    }
  });

  //--- Socket Error ---//
  document.addEventListener('websocket.error', function(event) {
    if (!ajaxFallback) {
      ajaxFallback = true;

      getUsingAjax();
      ajaxInterval = setInterval(getUsingAjax, 5000);
    }
  });


  //--- Message Listener ---//
  document.addEventListener('websocket.message', function(event) {
    var detail = event.detail;
    parseMessage(detail);
  });

  //--- Delete Message ---//
  document.addEventListener('click', function(event) {
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
    if (!ajaxFallback) {
      websocket.send({
        message: (this.checked ? message.value : ''),
        type: 'typing'
      });
    }
  });

  //--- Typing Data ---//
  message.addEventListener('keyup', function (event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      sendFormData.call(document.querySelector('.send.form'), event);
      event.stopPropagation();
      return false;
    }

    if (typing.checked && !ajaxFallback) {
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
