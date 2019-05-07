// Config
let partnersSpeed = 5000;

let presets = [{
  timestamp: (Date.now() / 1000) + 60,
  label: '#io19 #io19rp'
}, {
  timestamp: 1557229500,
  label: 'Bem-vindo! O evento começa em instantes.'
}, {
  timestamp: 1557246600,
  label: 'Almooooço! Voltamos às 13h30.'
}, {
  timestamp: 1557256500,
  label: '☕️ #c0ff33'
}];

// Get Params.
let url = new URL(location.href);
let searchParams = url.searchParams;

// Set Label
let labelElement = document.querySelector('.label');

function setLabel(label) {
  labelElement.innerHTML = label;
}

// Set Coutdown
function setCountdown(final) {
  var element, elements, interval;

  element = document.querySelector('.c-countdown');

  elements = {
    hours:   element.querySelector('.hours'),
    minutes: element.querySelector('.minutes'),
    seconds: element.querySelector('.seconds')
  };

  function pad(number) {
    return (number < 10 ? '0' : '') + number;
  }

  function getTimestamp() {
    var timestamp = new Date(final * 1000);
    return timestamp;
  }

  function update() {
    var time, timestamp, now;

    now = new Date();
    timestamp = getTimestamp() - now;

    if (timestamp < 0) {
      clearInterval(interval);
      location.href = '/countdown/waiting.html';
      return;
    }

    time = {
      hours: Math.floor((timestamp / (1000 * 60 * 60))),
      minutes: Math.floor((timestamp / 1000 / 60) % 60),
      seconds: Math.floor((timestamp / 1000) % 60)
    };

    elements.hours.textContent = pad(time.hours);
    elements.minutes.textContent = pad(time.minutes);
    elements.seconds.textContent = pad(time.seconds);
  }

  /* Interval */
  interval = setInterval(update, 1000);

  return;
}

// Set Preset
let id = searchParams.get('id');
let preset = presets[id || 0];

let labelParam = searchParams.get('label');
let timestampParam = searchParams.get('timestamp');

if (labelParam) {
  preset.label = labelParam;
}

if (timestampParam) {
  preset.timestamp = timestampParam;
}

setLabel(preset.label);
setCountdown(preset.timestamp);

// Partners
let partners = document.querySelectorAll('.partner');
let partnersInterval = partnersSpeed * partners.length;

function partnerLoop(partner) {
  partner.classList.add('in');

  setTimeout(function() {
    partner.classList.remove('in');
    partner.classList.add('out');
  }, (partnersSpeed - 1000));

  setTimeout(function() {
    partner.classList.remove('out');
  }, partnersSpeed);
}

[].forEach.call(partners, function(partner, index) {
  setTimeout(function() {
    partnerLoop(partner);

    setInterval(function() {
      partnerLoop(partner);
    }, partnersInterval);
  }, (partnersSpeed * index));
});
