import { saveCurrentLocation, getToken } from './navigation/navigation-helpers';
import { communication } from './communication';
import { settings } from './settings';
import { createAuth } from './auth/index.js';
import {
  navigation,
  getNavigationData,
  resolveNavigationNodes
} from './navigation/navigation-data-init';
import { onQuotaExceed } from './luigi-event-handlers';
import { saveAuthParamsIfPresent } from './auth/auth-params';

export const NODE_PARAM_PREFIX = `~`;

(async () => {
  saveAuthParamsIfPresent(location);
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
          getNavigationData(token).then(response => {
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
  if (e.data.msg === 'console.quotaexceeded') {
    onQuotaExceed(e.data);
  }
});
