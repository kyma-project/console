import OpenIdConnect from '@luigi-project/plugin-auth-oidc';
import { getAuthParams } from './auth-params';

export let groups;

async function fetchOidcProviderMetadata(issuerUrl) {
  try {
    const response = await fetch(`${issuerUrl}.well-known/openid-configuration`);
    return await response.json();
  }
  catch (e) {
    alert('Cannot fetch oidc provider metadata, see log console for more details');
    console.error('cannot fetch OIDC metadata', e);
  }
}

export const createAuth = async () => {
  const params = getAuthParams();
  if (!params) {
    alert("No auth params provided! In future you'll get to login with your service account.");
    console.log('for now just use query param: ?auth=EQbwOsCWDO0K4FMBOBVJAbCAuCALALvgA7RYD0ZA1gJ4C2AhgHQJyP1z64AMjAxgPa0yEADQRe6SAgB2-AJIATbBACsAdQAcATgBuAIQASAd2kAmWnADs0gCpc4ALx38AcgBYAHgGF-AMy64bgBW-C4QAL7AQAAA')
    return {};
  }

  const { issuerUrl, clientId, responseType, responseMode } = params;

  const providerMetadata = await fetchOidcProviderMetadata(issuerUrl);
  return {
    use: 'openIdConnect',
    openIdConnect: {
        idpProvider: OpenIdConnect,
        authority: issuerUrl,
        client_id: clientId,
        scope:
        'audience:server:client_id:kyma-client audience:server:client_id:console openid email profile groups',
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
            email: authData.profile.email
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
        onAuthError: err => {
        console.log('authErrorHandler 1', err);
        }
    },
    storage: 'none',
  };
}

export * from './auth-params';
