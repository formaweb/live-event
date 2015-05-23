var timeline = (function () {
  'use strict';

  //--- Private Methods ---//
  var body, toggleClass, messagesClass, messageTemplateClass;
  toggleClass = 'is-timeline-opened';
  messagesClass = 'js-messages';
  messageTemplateClass = 'message-template';


  //--- Private Methods ---//
  function messageTemplate() {
    
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
      var template, collection;
      template = messageTemplate(data);
      collection = ;
      collection.appendChild(template);
    },
    removeMessage: function (id) {
      document.getElementById('message-' + id).classList.add('removed');
    }
  };
}());