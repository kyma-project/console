
import {
  saveCurrentLocation,
  getPreviousLocation,
  setLimitExceededErrorsMessages
} from './navigation/navigation-helpers';
import { communication } from './communication';
import { config } from './config';
import { navigation, getNavigationData, getToken } from './navigation/navigation-data-init';


function getFreshKeys() {
  // manually re-fetching keys, since this is a major pain point
  // until dex has possibility of no-cache
  return fetch('https://dex.' + config.domain + '/keys', { cache: 'no-cache' });
}


window.addEventListener('message', e => {
  const SHOW_SYSTEM_NAMESPACES_CHANGE_EVENT =
    'showSystemNamespacesChangedEvent';

  if (e.data && e.data.msg === 'luigi.refresh-context-switcher') {
    window.Luigi.cachedNamespaces = null;
  } else if (e.data && e.data.msg === SHOW_SYSTEM_NAMESPACES_CHANGE_EVENT) {
    Luigi.customMessages().sendToAll({
      id: SHOW_SYSTEM_NAMESPACES_CHANGE_EVENT,
      showSystemNamespaces: e.data.showSystemNamespaces
    });
  }
});


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
            navigation.nodes = response[0];
            luigiConfig.settings.sideNavFooterText = response[1];
            Luigi.configChanged('navigation');
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
    const namespace = e.data.namespace;
    const data = e.data.data;
    let limitHasBeenExceeded;
    let limitExceededErrors;
    if (data && data.resourceQuotasStatus) {
      limitHasBeenExceeded = data.resourceQuotasStatus.exceeded;
    }
    if (
      data &&
      data.resourceQuotasStatus &&
      data.resourceQuotasStatus.exceededQuotas &&
      data.resourceQuotasStatus.exceededQuotas.length > 0
    ) {
      limitExceededErrors = setLimitExceededErrorsMessages(
        data.resourceQuotasStatus.exceededQuotas
      );
      const linkdata = {
        goToResourcesConfig: {
          text: 'Resources Configuration',
          url: `/home/namespaces/${namespace}/resources`
        }
      };
      let errorText = `Error ! The following resource quota limit has been exceeded by the given resource:<br>`;
      limitExceededErrors.forEach(error => {
        errorText += `-${error}<br>`;
      });
      errorText += `See {goToResourcesConfig} for details.`;
      const settings = {
        text: errorText,
        type: 'error',
        links: linkdata
      };
      window.postMessage(
        {
          msg: 'luigi.ux.alert.show',
          data: { settings }
        },
        '*'
      );
    }
  }
});


