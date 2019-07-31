// create graphql-ready form of API
export function createAPI({ apiData, credentialsData }) {
  const {
    name,
    description,
    group,
    targetURL,
    loadedFileContent,
    actualFileType,
    apiSubType,
  } = apiData;

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
    defaultAuth: {
      credential: {
        oauth: credentialsData.oAuth,
      },
    },
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
