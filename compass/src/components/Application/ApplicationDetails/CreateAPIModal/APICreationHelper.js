import { CREDENTIAL_TYPE_OAUTH } from './Forms/CredentialForms/OAuthCredentialsForm';

// create graphql-ready form of API
export function createAPI({ apiData, credentialsForm }) {
  const {
    name,
    description,
    group,
    targetURL,
    loadedFileContent,
    actualFileType,
    apiSubType,
  } = apiData;

  let defaultAuth = null;
  if (credentialsForm.type === CREDENTIAL_TYPE_OAUTH) {
    defaultAuth = {
      credential: {
        oauth: credentialsForm.oAuth,
      },
    };
  }

  return {
    name,
    description,
    group: group ? group : null, // if group is '', just write null
    targetURL,
    spec: {
      data: loadedFileContent,
      format: actualFileType,
      type: apiSubType,
    },
    defaultAuth,
  };
}

// create graphql-ready form of Event API
export function createEventAPI({ apiData }) {
  const {
    name,
    description,
    group,
    loadedFileContent,
    actualFileType,
    apiSubType,
  } = apiData;

  return {
    name,
    description,
    group: group ? group : null, // if group is '', just write null
    spec: {
      data: loadedFileContent,
      format: actualFileType,
      eventSpecType: apiSubType,
    },
  };
}
