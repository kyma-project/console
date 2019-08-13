import { PRELOAD_PATH } from '../constants';

export function preloadingStrategy(popstateCallback: () => Promise<void>) {
  const path = window.location.href.split('/').reverse()[0];
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
