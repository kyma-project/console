window.addEventListener('load', (_) => {
  try {
    document.getElementById('btn-login').onclick = login;
  } catch {}
  try {
    document.getElementById('btn-try-again').onclick = tryAgain;
  } catch {}
});

function login() {
  window.location.href = window.location.origin;
}

function getUrlParameter(name) {
  return new URL(location.href).searchParams.get(name);
}

var reason = getUrlParameter('reason');
var error = getUrlParameter('error');

if (error) {
  document.getElementById('message').innerText = error;
}

switch (reason) {
  case 'tokenExpired':
    sessionStorage.removeItem('luigi.auth');
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
