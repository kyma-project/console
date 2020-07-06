import {
  CREDENTIAL_TYPE_NONE,
  CREDENTIAL_TYPE_OAUTH,
  CREDENTIAL_TYPE_BASIC,
  CREDENTIAL_TYPE_EMPTY,
  getRefsValues,
} from 'react-shared';

export const inferCredentialType = instanceAuth => {
  if (!instanceAuth) {
    return CREDENTIAL_TYPE_NONE;
  }
  const credentials = instanceAuth.credential;
  if (credentials && credentials.__typename) {
    if (credentials.__typename === 'OAuthCredentialData') {
      return CREDENTIAL_TYPE_OAUTH;
    } else if (credentials.__typename === 'BasicCredentialData') {
      return CREDENTIAL_TYPE_BASIC;
    }
  }
  return CREDENTIAL_TYPE_EMPTY;
};

export const inferDefaultCredentials = (credentialType, instanceAuth) => {
  switch (credentialType) {
    case CREDENTIAL_TYPE_BASIC:
      return { basic: instanceAuth ? instanceAuth.credential : {} };
    case CREDENTIAL_TYPE_OAUTH:
      return { oAuth: instanceAuth ? instanceAuth.credential : {} };
    default:
      return null;
  }
};

export const getCredentialsRefsValue = (credentialRefs, credentialsType) => {
  switch (credentialsType) {
    case CREDENTIAL_TYPE_BASIC:
      const basicValues = getRefsValues(credentialRefs.basic);
      return { credential: { basic: basicValues } };
    case CREDENTIAL_TYPE_OAUTH:
      const oAuthValues = getRefsValues(credentialRefs.oAuth);
      return { credential: { oauth: oAuthValues } };
    case CREDENTIAL_TYPE_EMPTY:
      return { credential: null };
    default:
      return null;
  }
};
