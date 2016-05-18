var timeline = (function () {
  'use strict';

  //--- Private Variables ---//
  var body, toggleClass, messagesClass, messageTemplateClass;
  toggleClass = 'is-timeline-opened';
  messagesClass = 'js-messages';
  messageTemplateClass = 'js-message-template';


  //--- Private Methods ---//
  function messageTemplate(data) {
    var template, message, content, contentImage, meta;

    template = document.getElementsByClassName(messageTemplateClass)[0].content;
    template = template.cloneNode(true);

    message = template.querySelector('.message');
    content = template.querySelector('.content');
    meta = template.querySelector('.meta');

    message.classList.add('message-' + data.id);

    if (data.image) {
      contentImage = document.createElement('img');
      contentImage.src = data.image;
      content.appendChild(contentImage);
    }

    content.appendChild(document.createTextNode(data.message));

    meta.textContent = data.user_name;

    return template;
  }


  //--- Public Methods ---//
  return {
    showTimeline: function () {
      document.body.classList.add(toggleClass);
    },
    hideTimeline: function () {
      document.body.classList.remove(toggleClass);
    },
    addMessage: function (data) {
      if(document.querySelector('.message-' + data.id)) return;

      var template = messageTemplate(data);
      document.getElementsByClassName(messagesClass)[0].appendChild(template);
      document.body.classList.add(toggleClass);
    },
    removeMessage: function (id) {
      if(!document.querySelector('.message-' + id)) return;
      document.querySelector('.message-' + id).classList.add('removed');
    }
  };
}());
