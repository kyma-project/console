import OpenIdConnect from '@luigi-project/plugin-auth-oidc';
import { getAuthParams } from './auth-params';
import { getPreviousLocation } from './../navigation/navigation-helpers';

export let groups;

async function fetchOidcProviderMetadata(issuerUrl) {
  try {
    const response = await fetch(`${issuerUrl}.well-known/openid-configuration`);
    return await response.json();
  }
  catch (e) {
    alert('Cannot fetch oidc provider metadata, see log console for more details');
    console.error('cannot fetch oidc metadata', e);
  }
}

export const createAuth = async () => {
  const params = getAuthParams();
  if (!params) {
    alert("No auth params provided! In future you'll get to login with your service account.");
    console.log('for now just use query param: ?auth=%7B%22issuerUrl%22%3A%22https%3A%2F%2Fkyma.eu.auth0.com%2F%22%2C%22clientId%22%3A%225W89vBHwn2mu7nT0uzvoN4xCof0h4jtN%22%7D')
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
    storage: 'none',
  };
}

export * from './auth-params';
