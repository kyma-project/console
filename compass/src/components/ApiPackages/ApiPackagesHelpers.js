import {
  CREDENTIAL_TYPE_NONE,
  CREDENTIAL_TYPE_OAUTH,
  CREDENTIAL_TYPE_BASIC,
  getRefsValues,
} from 'react-shared';

export const inferCredentialType = credentials => {
  if (credentials && credentials.__typename) {
    if (credentials.__typename === 'OAuthCredentialData') {
      return CREDENTIAL_TYPE_OAUTH;
    } else if (credentials.__typename === 'BasicCredentialData') {
      return CREDENTIAL_TYPE_BASIC;
    }
  }
  return CREDENTIAL_TYPE_NONE;
};

export const inferDefaultCredentials = (credentialsType, credentials) => {
  if (credentialsType === CREDENTIAL_TYPE_OAUTH) {
    return {
      oAuth: {
        ...credentials,
      },
    };
  } else if (credentialsType === CREDENTIAL_TYPE_BASIC) {
    return {
      basic: {
        ...credentials,
      },
    };
  }
  return null;
};

export const getCredentialsRefsValue = credentialRefs => {
  const oAuthValues = getRefsValues(credentialRefs.oAuth);
  const basicValues = getRefsValues(credentialRefs.basic);
  let credentials = null;
  if (oAuthValues && Object.keys(oAuthValues).length !== 0) {
    credentials = { credential: { oauth: oAuthValues } };
  } else if (basicValues && Object.keys(basicValues).length !== 0) {
    credentials = { credential: { basic: basicValues } };
  }
  return credentials;
};
