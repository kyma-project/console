function login() {
  window.location.href = window.location.origin;
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return (results && decodeURIComponent(results[1].replace(/\+/g, ' '))) || '';
}

var reason = getUrlParameter('reason');
var error = getUrlParameter('error');

if (error) {
  document.getElementById('message').innerText = error;
}

switch (reason) {
  case 'tokenExpired':
    document.getElementById('headline').innerText = 'Your session has expired.';
    break;
  case 'loginError':
    document.getElementById('headline').innerText =
      'Ooops, something went wrong.';
    document.getElementById('message').innerText =
      'Please try to log in again.';
    break;
  default:
    break;
}

function tryAgain() {
  window.location.href = window.location.origin;
}
