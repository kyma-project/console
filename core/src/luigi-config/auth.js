import OpenIdConnect from '@luigi-project/plugin-auth-oidc';
// import { config } from './config';
import { parseJWT, getPreviousLocation } from './navigation/navigation-helpers';

async function fetchOidcProviderMetadata() {
  // const idpUrl = config.defaultIdpIssuer;
  var idpUrl = 'https://kyma.eu.auth0.com'; // todo unhardcode

  try {
    const response = await fetch(`${idpUrl}/.well-known/openid-configuration`);
    return await response.json();
  }
  catch (e) {
    alert('Cannot fetch oidc provider metadata, see log console for more details');
    console.error('cannot fetch dex metadata', e);
  }
}

export const createAuth = async () => {
  const providerMetadata = await fetchOidcProviderMetadata();
  return {
    use: 'openIdConnect',
    openIdConnect: {
        idpProvider: OpenIdConnect,
        authority: 'https://kyma.eu.auth0.com/', // todo unhardcode
        client_id: '5W89vBHwn2mu7nT0uzvoN4xCof0h4jtN', // this one too
        scope:
        'audience:server:client_id:kyma-client audience:server:client_id:console openid email profile groups',
        response_type: 'code',
        response_mode: 'query',
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
