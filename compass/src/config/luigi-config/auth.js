import OpenIdConnect from '@luigi-project/plugin-auth-oidc';

const domain =
  (window.clusterConfig && window.clusterConfig['domain']) || 'kyma.local';

const authClusterConfig = window.clusterConfig && window.clusterConfig.auth;
const clientId = authClusterConfig
  ? authClusterConfig['client_id']
  : 'compass-ui';

export default function createAuth(dexMetadata) {
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
    storage: 'sessionStorage',
  };
}
