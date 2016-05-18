var timeline = (function () {
  'use strict';

  //--- Private Variables ---//
  var body, messagesClass, messageTemplateClass, usersClass, userTemplateClass;
  messagesClass = 'js-messages';
  messageTemplateClass = 'js-message-template';
  usersClass = 'js-users';
  userTemplateClass = 'js-user-template';


  //--- Private Methods ---//
  function scrollDown() {
    var messages = document.getElementsByClassName(messagesClass)[0];
    messages.scrollTop = messages.scrollHeight;
  }

  function messageTemplate(data, userId) {
    var template, message, meta, userPhoto, userName, closeButton, content, contentImage;

    template = document.getElementsByClassName(messageTemplateClass)[0].content;
    template = template.cloneNode(true);

    meta = template.querySelector('.meta');
    userName = meta.querySelector('.user-name');
    closeButton = meta.querySelector('.delete-message');

    message = template.querySelector('.message');
    content = template.querySelector('.content');

    if (data.user_photo) {
      userPhoto = document.createElement('img');
      userPhoto.src = data.user_photo;
      userPhoto.classList.add('user-photo');
      meta.appendChild(userPhoto);
    }

    userName.textContent = data.user_name;
    closeButton.dataset.messageId = data.id;

    message.classList.add('message-' + data.id);
    message.dataset.messageId = data.id;

    if (data.image) {
      contentImage = document.createElement('img');
      contentImage.src = data.image;
      contentImage.onload = scrollDown;
      content.appendChild(contentImage);
    }

    if (data.user_id != userId) {
      closeButton.remove();
    }

    content.appendChild(document.createTextNode(data.message));

    return template;
  }

  function userTemplate(data) {
    var template, user, meta;

    template = document.getElementsByClassName(userTemplateClass)[0].content;
    template = template.cloneNode(true);

    user = template.querySelector('.js-user');
    user.classList.add('js-user-' + data.user_id)

    meta = user.querySelector('.meta');
    meta.textContent = data.user_name;

    return template;
  }


  //--- Public Methods ---//
  return {
    addMessage: function (data, userId) {
      if(document.querySelector('.message-' + data.id)) return;

      var template = messageTemplate(data, userId);
      document.getElementsByClassName(messagesClass)[0].appendChild(template);
      scrollDown();
    },
    removeMessage: function (id) {
      if(!document.querySelector('.message-' + id)) return;
      document.querySelector('.message-' + id).classList.add('deleted');
    },

    addUser: function (data) {
      var template = userTemplate(data);
      document.getElementsByClassName(usersClass)[0].appendChild(template);
    },
    removeUser: function (id) {
      document.querySelector('.js-user-' + id).remove();
    },
    updateUserMessage: function (id, message) {
      var user, content, awayClass, awayMessage;
      user = document.querySelector('.js-user-' + id);
      content = user.querySelector('.content');
      awayClass = 'away';
      awayMessage = 'Nenhuma atividade identificada.';

      if (message) {
        content.classList.remove(awayClass);
        content.textContent = message;
      } else {
        content.classList.add(awayClass);
        content.textContent = awayMessage;
      }
    },

    scrollDown: scrollDown
  };
}());
