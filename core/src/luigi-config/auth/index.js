import OpenIdConnect from '@luigi-project/plugin-auth-oidc';
import parseJWT from "jwt-decode";
import { getAuthParams, inferResponseData } from './auth-params';
import { getPreviousLocation } from './../navigation/navigation-helpers';

async function fetchOidcProviderMetadata(issuerUrl) {
  try {
    const response = await fetch(`${issuerUrl}.well-known/openid-configuration`);
    return await response.json();
  }
  catch (e) {
    alert('Cannot fetch oidc provider metadata, see log console for more details');
    console.error('cannot fetch dex metadata', e);
  }
}

export const createAuth = async () => {
  const { issuerUrl, clientId, usePKCE = true } = getAuthParams();
  if (!issuerUrl || !clientId) {
    alert("No auth params provided! In future you'll get to login with your service account.");
    console.log('for now just use query param: ?auth=%7B%22issuerUrl%22%3A%22https%3A%2F%2Fkyma.eu.auth0.com%2F%22%2C%22clientId%22%3A%225W89vBHwn2mu7nT0uzvoN4xCof0h4jtN%22%7D')
    return {};
  }

  const {
    responseType,
    responseMode
  } = inferResponseData(usePKCE);

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
