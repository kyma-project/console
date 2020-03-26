import OpenIdConnect from '@luigi-project/plugin-auth-oidc';
import { config } from './config';
import { parseJWT, getPreviousLocation } from './navigation/navigation-helpers';

async function fetchDexMetadata() {
    const domain =
      (window.clusterConfig && window.clusterConfig['domain']) || 'pijany.hasselhoff.ga';
  
    try {
      const response = await fetch(`https://dex.${domain}/.well-known/openid-configuration`);
      return await response.json();
    }
    catch (e) {
      alert('Cannot fetch dex metadata');
      console.error('cannot fetch dex metadata', e);
    }
  }
  
export default async function createAuth() {
  const dexMetadata = await fetchDexMetadata();
  return {
    use: 'openIdConnect',
    openIdConnect: {
        idpProvider: OpenIdConnect,
        authority: 'https://dex.' + config.domain,
        client_id: 'console',
        scope:
        'audience:server:client_id:kyma-client audience:server:client_id:console openid email profile groups',
        automaticSilentRenew: true,
        loadUserInfo: false,
        logoutUrl: 'logout.html',
        metadata: {
        ...dexMetadata,
        end_session_endpoint: 'logout.html',
        },
        userInfoFn: (authSettings, authData) => {
        return new Promise((resolve) => {
            const userInfo = {};
            try {
            const data = parseJWT(authData.idToken)
            userInfo.name = data.name
            userInfo.email = data.email
            } catch (err) {
            console.error("Could not parse JWT token", err)
            }
            resolve(userInfo)
        })
        },
        profileStorageInterceptorFn: () => {
        try {
            const oidcUserStoreKey = `oidc.user:https://dex.${config.domain}:console`;
            const oidsUserStore = JSON.parse(sessionStorage.getItem(oidcUserStoreKey));
            oidsUserStore.profile = undefined;
            sessionStorage.setItem(oidcUserStoreKey, JSON.stringify(oidsUserStore));
        } catch (e) {
            console.error("Error parsing oidc user data", e);
        }
        }
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
    };
}
