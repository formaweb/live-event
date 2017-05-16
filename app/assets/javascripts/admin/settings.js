var settings = (function () {
  'use strict';

  //--- Private Variables ---//
  var brandClass, videoClass;
  brandClass = 'brand';
  videoClass = 'video';


  //--- Private Methods ---//
  function updateName(name) {
    name = name.trim();
    document.getElementsByClassName(brandClass)[0].textContent = name;
    event_name.value = name;
  }

  function updateVideo(videoId, videoUrl) {
    var videoElement, iframeElement;
    videoElement = document.getElementsByClassName(videoClass)[0];

    if (videoUrl) {
      videoElement.dataset.videoUrl = videoUrl;
    }

    if (!videoId) {
      videoElement.innerHTML = '';
      videoElement.dataset.videoId = '';
    }

    if (videoId && videoId !== videoElement.dataset.videoId) {
      videoElement.innerHTML = '';
      videoElement.dataset.videoId = '';

      iframeElement = document.createElement('iframe');
      iframeElement.src = '//youtube.com/embed/' + videoId
      iframeElement.setAttribute('allowFullScreen', '');

      videoElement.appendChild(iframeElement);
      videoElement.dataset.videoId = videoId;
    }

    video_url.value = videoUrl || '';
  }


  //--- Public Methods ---//
  return {
    updateName: updateName,
    updateVideo: updateVideo
  };
}());
