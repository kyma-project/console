import OpenIdConnect from '@luigi-project/plugin-auth-oidc';
import { getInitParams } from './init-params';

export let groups;

async function fetchOidcProviderMetadata(issuerUrl) {
  try {
    const response = await fetch(
      `${issuerUrl}.well-known/openid-configuration`
    );
    return await response.json();
  } catch (e) {
    alert(
      'Cannot fetch oidc provider metadata, see log console for more details'
    );
    console.error('cannot fetch OIDC metadata', e);
  }
}

export const createAuth = async () => {
  const params = getInitParams();
  if (!params) {
    alert(
      "No auth params provided! In future you'll get to login with your service account."
    );
    return {};
  }

  const { issuerUrl, clientId, responseType, responseMode, scope } = params;

  const providerMetadata = await fetchOidcProviderMetadata(issuerUrl);
  return {
    use: 'openIdConnect',
    openIdConnect: {
      idpProvider: OpenIdConnect,
      authority: issuerUrl,
      client_id: clientId,
      scope: scope || 'openid',
      response_type: responseType,
      response_mode: responseMode,
      automaticSilentRenew: true,
      loadUserInfo: false,
      logoutUrl: 'logout.html',
      metadata: {
        ...providerMetadata,
        end_session_endpoint: 'logout.html',
      },
      userInfoFn: (_, authData) => {
        groups = authData.profile['http://k8s/groups'];
        return Promise.resolve({
          name: authData.profile.name,
          email: authData.profile.email,
        });
      },
    },

    events: {
      onLogout: () => {
        console.log('onLogout');
      },
      onAuthExpired: () => {
        console.log('onAuthExpired');
      },
      // TODO: define luigi-client api for getting errors
      onAuthError: (err) => {
        console.log('authErrorHandler 1', err);
      },
    },
    storage: 'none',
  };
};
