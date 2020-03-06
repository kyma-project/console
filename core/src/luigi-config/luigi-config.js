
import {
  saveCurrentLocation,
  getPreviousLocation,
  getToken
} from './navigation/navigation-helpers';
import { communication } from './communication';
import { config } from './config';
import { navigation, getNavigationData, resolveNavigationNodes } from './navigation/navigation-data-init';
import { onQuotaExceed } from './luigi-event-handlers';


function getFreshKeys() {
  // manually re-fetching keys, since this is a major pain point
  // until dex has possibility of no-cache
  return fetch('https://dex.' + config.domain + '/keys', { cache: 'no-cache' });
}

getFreshKeys()

const luigiConfig = {
  auth: {
    use: 'openIdConnect',
    openIdConnect: {
      authority: 'https://dex.' + config.domain,
      client_id: 'console',
      scope:
        'audience:server:client_id:kyma-client audience:server:client_id:console openid email profile groups',
      automaticSilentRenew: true,
      loadUserInfo: false,
      logoutUrl: 'logout.html'
    },

    events: {
      onLogout: () => {
        console.log('onLogout');
      },
      onAuthSuccessful: () => {
        const prevLocation = getPreviousLocation();
        if (prevLocation) {
          window.location.replace(prevLocation);
        }
      },
      onAuthExpired: () => {
        console.log('onAuthExpired');
      },
      // TODO: define luigi-client api for getting errors
      onAuthError: err => {
        console.log('authErrorHandler 1', err);
      }
    },
    storage: 'sessionStorage'
  },
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
    }
  },
  lifecycleHooks: {
    luigiAfterInit: () => {
      const token = getToken()
      if(token){
        getNavigationData().then(
          response => {
            resolveNavigationNodes(response[0]);
            luigiConfig.settings.sideNavFooterText = response[1];
            Luigi.configChanged('settings');
          }
        )
      } else {
        saveCurrentLocation();
      }
    }
  }
};
Luigi.setConfig(luigiConfig);

window.addEventListener('message', e => {
  if (e.data.msg && e.data.msg === 'console.quotaexceeded') {
    onQuotaExceed(e.data);
  }
});
