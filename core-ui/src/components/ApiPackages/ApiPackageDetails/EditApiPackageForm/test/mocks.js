import { GET_API_PACKAGE } from 'gql/queries';
import { UPDATE_API_PACKAGE } from 'gql/mutations';

export const apiPackageMock = {
  id: 'package-id',
  name: 'api-package-1',
  description: 'desc',
  instanceAuthRequestInputSchema: '{}',
};

export const basicCredentialsMock = {
  username: 'basic-username',
  password: 'basic-password',
};

export const oAuthCredentialsMock = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  url: 'https://test',
};

export const updateApiPackageMock = {
  request: {
    query: UPDATE_API_PACKAGE,
    variables: {
      id: 'package-id',
      in: {
        name: 'api-package-name-2',
        description: 'api-package-description-2',
        instanceAuthRequestInputSchema: '{}',
        defaultInstanceAuth: null,
      },
    },
  },
  result: {
    data: {
      updatePackage: {
        name: 'package',
      },
    },
  },
};

export const updateApiPackageWithBasicMock = {
  request: {
    query: UPDATE_API_PACKAGE,
    variables: {
      id: 'package-id',
      in: {
        name: 'api-package-1',
        description: 'desc',
        instanceAuthRequestInputSchema: '{}',
        defaultInstanceAuth: {
          credential: {
            basic: basicCredentialsMock,
          },
        },
      },
    },
  },
  result: {
    data: {
      updatePackage: {
        name: 'package',
      },
    },
  },
};

export const updateApiPackageWithOAuthMock = {
  request: {
    query: UPDATE_API_PACKAGE,
    variables: {
      id: 'package-id',
      in: {
        name: 'api-package-1',
        description: 'desc',
        instanceAuthRequestInputSchema: '{}',
        defaultInstanceAuth: {
          credential: {
            oauth: oAuthCredentialsMock,
          },
        },
      },
    },
  },
  result: {
    data: {
      updatePackage: {
        name: 'package',
      },
    },
  },
};

export const refetchApiPackageMock = {
  request: {
    query: GET_API_PACKAGE,
    variables: {
      applicationId: 'app-id',
      apiPackageId: 'package-id',
    },
  },
  result: {
    data: {
      application: {
        id: 'app-id',
        name: 'app-name',
        package: {
          id: 'package-id',
          name: 'api-package-name-2',
          description: '',
          instanceAuthRequestInputSchema: '{}',
          instanceAuths: [],
          apiDefinitions: [],
          eventDefinitions: [],
          defaultInstanceAuth: null,
        },
      },
    },
  },
};
