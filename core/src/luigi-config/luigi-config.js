import { saveCurrentLocation, getToken } from './navigation/navigation-helpers';
import { communication } from './communication';
import { settings } from './settings';
import { config } from './config';
import createAuth from './auth';
import {
  navigation,
  getNavigationData,
  resolveNavigationNodes
} from './navigation/navigation-data-init';
import { onQuotaExceed } from './luigi-event-handlers';

export const NODE_PARAM_PREFIX = `~`;

(function getFreshKeys() {
  // manually re-fetching keys, since this is a major pain point
  // until dex has possibility of no-cache
  return fetch('https://dex.' + config.domain + '/keys', { cache: 'no-cache' });
})();

(async () => {
  const luigiConfig = {
    auth: await createAuth(),
    communication,
    navigation,
    routing: {
      nodeParamPrefix: NODE_PARAM_PREFIX,
      skipRoutingForUrlPatterns: [/access_token=/, /id_token=/]
    },
    settings,
    lifecycleHooks: {
      luigiAfterInit: () => {
        const showSystemNamespaces = localStorage.getItem(
          'console.showSystemNamespaces'
        );

        if (showSystemNamespaces === 'true') {
          Luigi.featureToggles().setFeatureToggle('showSystemNamespaces');
        } else {
          Luigi.featureToggles().unsetFeatureToggle('showSystemNamespaces');
        }
        const token = getToken();
        if (token) {
          getNavigationData().then(response => {
            resolveNavigationNodes(response[0]);
            luigiConfig.settings.sideNavFooterText = response[1];
            Luigi.configChanged('settings');
            Luigi.ux().hideAppLoadingIndicator();
          });
        } else {
          saveCurrentLocation();
        }
      }
    }
  };
  Luigi.setConfig(luigiConfig);
})();

window.addEventListener('message', e => {
  if (e.data.msg && e.data.msg === 'console.quotaexceeded') {
    onQuotaExceed(e.data);
  }
});
