import OpenIdConnect from '@luigi-project/plugin-auth-oidc';
import { clusterConfig } from './clusterConfig';
import { getPreviousLocation } from './helpers/navigation-helpers';

async function fetchDexMetadata() {
  const domain = clusterConfig['domain'];

  try {
    const response = await fetch(
      `https://dex.${domain}/.well-known/openid-configuration`,
    );
    return await response.json();
  } catch (e) {
    alert('Cannot fetch dex metadata');
    console.error('cannot fetch dex metadata', e);
  }
}

export default async function createAuth() {
  const domain = clusterConfig['domain'];

  const authClusterConfig = clusterConfig.auth;
  const clientId = authClusterConfig
    ? authClusterConfig['client_id']
    : 'compass-ui';

  const dexMetadata = await fetchDexMetadata();
  return {
    use: 'openIdConnect',
    openIdConnect: {
      metadata: {
        ...dexMetadata,
        end_session_endpoint: 'logout.html',
      },
      idpProvider: OpenIdConnect,
      authority: authClusterConfig
        ? authClusterConfig['authority']
        : `https://dex.${domain}`,
      client_id: clientId,
      scope: authClusterConfig
        ? authClusterConfig['scope']
        : 'audience:server:client_id:compass-ui openid profile email groups',
      loadUserInfo: false,
      logoutUrl: '/logout.html',
      profileStorageInterceptorFn: () => {
        try {
          const oidcUserStoreKey = `oidc.user:https://dex.${domain}:${clientId}`;
          const oidsUserStore = JSON.parse(
            sessionStorage.getItem(oidcUserStoreKey),
          );
          oidsUserStore.profile = undefined;
          sessionStorage.setItem(
            oidcUserStoreKey,
            JSON.stringify(oidsUserStore),
          );
        } catch (e) {
          console.error('Error parsing oidc user data', e);
        }
      },
    },
    events: {
      onAuthSuccessful: () => {
        const prevLocation = getPreviousLocation();
        if (prevLocation) {
          window.location.replace(prevLocation);
        }
      },
    },
    storage: 'sessionStorage',
  };
}
