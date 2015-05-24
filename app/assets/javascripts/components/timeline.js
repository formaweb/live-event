var timeline = (function () {
  'use strict';

  //--- Private Variables ---//
  var body, toggleClass, messagesClass, messageTemplateClass;
  toggleClass = 'is-timeline-opened';
  messagesClass = 'js-messages';
  messageTemplateClass = 'js-message-template';


  //--- Private Methods ---//
  function messageTemplate(data) {
    var template, message, content, meta;

    template = document.getElementsByClassName(messageTemplateClass)[0].content;
    message = template.querySelector('.message');
    content = template.querySelector('.content');
    meta = template.querySelector('.meta');

    message.classList.add('message-' + data.id);
    content.textContent = data.message;
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
      var template = messageTemplate(data);
      document.getElementsByClassName(messagesClass)[0].appendChild(template);
    },
    removeMessage: function (id) {
      document.getElementsByClassName('message-' + id)[0].classList.add('removed');
    }
  };
}());