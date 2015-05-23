var timeline = (function () {
  'use strict';

  //--- Private Methods ---//
  var body, toggleClass, messageTemplateClass;
  toggleClass = 'is-timeline-opened';
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
    addMessage: function () {
      
    },
    removeMessage: function (id) {
      document.getElementById('message-' + id).classList.add('removed');
    }
  };
}());