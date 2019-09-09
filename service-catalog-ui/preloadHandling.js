export default function handlePreload(startAppFn) {
  const path = new URL(window.location.href).pathname;

  if (path === '/preload') {
    window.addEventListener('popstate', function listenToPopState() {
      window.removeEventListener('popstate', listenToPopState);
      startAppFn();
    });
  } else {
    startAppFn();
  }
}
