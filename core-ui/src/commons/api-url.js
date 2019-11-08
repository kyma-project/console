import builder from './builder';
export { getApiUrl as getURL } from '@kyma-project/common';

const CURRENT_ENV_TAG = '{CURRENT_ENV}';

export function openLink(path) {
  if (process.env.REACT_APP_ENV !== 'production') {
    window.location.replace(path);
  }

  const redirectPath = path.replace(
    CURRENT_ENV_TAG,
    builder.getCurrentEnvironmentId(),
  );
  window.parent.postMessage(
    {
      msg: 'navigation.open',
      params: {
        link: redirectPath,
      },
    },
    '*',
  );
}
