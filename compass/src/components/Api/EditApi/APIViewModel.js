import { CREDENTIAL_TYPE_NONE } from './../../Api/Forms/CredentialsForm';
import { CREDENTIAL_TYPE_OAUTH } from '../../Api/Forms/CredentialForms/OAuthCredentialsForm';
import _ from 'lodash';

export function toAPI({ generalInformation, spec, credentials }) {
  let auth = null;
  if (credentials.type === CREDENTIAL_TYPE_OAUTH) {
    auth = {
      credential: { oauth: credentials.oAuth },
    };
  }

  return {
    ...generalInformation,
    spec: {
      data: spec.data,
      format: spec.format,
      type: spec.type,
    },
    defaultAuth: auth,
  };
}

export function toEventAPI({ generalInformation, spec }) {
  // make sure targetURL doesn't get into event API
  const { targetURL, ...generalData } = generalInformation;

  return {
    ...generalData,
    spec: {
      data: spec.data,
      format: spec.format,
      eventSpecType: spec.type,
    },
  };
}

export function fromAPI(originalApiData) {
  const entry = originalApiData.entry;
  return {
    id: originalApiData.entry.id,
    apiType: originalApiData.type,
    generalInformation: {
      name: entry.name,
      description: entry.description,
      group: entry.group,
      targetURL: entry.targetURL,
    },
    spec: {
      specChanged: false,
      isSpecValid: true,
      ...entry.spec,
    },
    credentials: {
      oAuth: {
        clientId: '',
        clientSecret: '',
        url: '',
      },
      ...getCredentials(originalApiData),
    },
  };
}

export function areApisEqual(edited, original) {
  // general information
  if (!_.isEqual(edited.generalInformation, original.generalInformation)) {
    return false;
  }
  // spec content
  if (edited.spec.specChanged) {
    return false;
  }
  //  credentials type
  if (edited.credentials.type !== original.credentials.type) {
    return false;
  }
  //oAuth data
  if (
    edited.credentials.type === CREDENTIAL_TYPE_OAUTH &&
    !_.isEqual(edited.credentials.oAuth, original.credentials.oAuth)
  ) {
    return false;
  }

  return true;
}

function getCredentials(apiData) {
  if (apiData.type !== 'API') {
    return null;
  }

  const defaultAuth = apiData.entry.defaultAuth;

  if (!defaultAuth) {
    return { type: CREDENTIAL_TYPE_NONE };
  } else {
    const credential = defaultAuth.credential;
    switch (credential.__typename) {
      case 'OAuthCredentialData':
        const { __typename, ...oAuth } = credential;
        return { type: CREDENTIAL_TYPE_OAUTH, oAuth };
      default:
        return { type: CREDENTIAL_TYPE_NONE };
    }
  }
}
