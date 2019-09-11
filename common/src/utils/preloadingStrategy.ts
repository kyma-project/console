import { PRELOAD_PATH } from '../constants';

export function preloadingStrategy(popstateCallback: () => Promise<void>) {
  const path = new URL(window.location.href).pathname;
  if (path !== PRELOAD_PATH) {
    popstateCallback();
    return;
  }

  window.addEventListener(
    'popstate',
    function _listener() {
      window.removeEventListener('popstate', _listener, true);
      popstateCallback();
    },
    true,
  );
}
