
import { saveCurrentLocation, getToken } from './navigation/navigation-helpers';
import { communication } from './communication';
import { config } from './config';
import createAuth from './auth';
import { navigation, getNavigationData, resolveNavigationNodes } from './navigation/navigation-data-init';
import { onQuotaExceed } from './luigi-event-handlers';


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
      nodeParamPrefix: '~',
      skipRoutingForUrlPatterns: [/access_token=/, /id_token=/]
    },
    settings: {
      responsiveNavigation: 'simpleMobileOnly',
      sideNavFooterText: '',
      header: () => {
        const logo =
          config && config.headerLogoUrl
            ? config.headerLogoUrl
            : '/assets/logo.svg';
        const title = config ? config.headerTitle : undefined;
        const favicon = config
          ? config.faviconUrl
          : undefined;
        return {
          logo,
          title,
          favicon
        };
      },
      appLoadingIndicator: {
        hideAutomatically: false
      }
    },
    lifecycleHooks: {
      luigiAfterInit: () => {
        const token = getToken()
        if (token) {
          getNavigationData().then(
            response => {
              resolveNavigationNodes(response[0]);
              luigiConfig.settings.sideNavFooterText = response[1];
              Luigi.configChanged('settings');
              Luigi.ux().hideAppLoadingIndicator();
            }
          )
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
