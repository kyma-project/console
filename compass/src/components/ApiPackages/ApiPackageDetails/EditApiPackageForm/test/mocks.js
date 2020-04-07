import { UPDATE_API_PACKAGE, GET_API_PACKAGE } from './../../../gql';

export const apiPackageMock = {
  id: 'package-id',
  name: 'api-package-1',
  description: 'desc',
  instanceAuthRequestInputSchema: '{}',
  defaultInstanceAuth: null,
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

export const oAuthDataMock = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  url: 'https://test',
  __typename: 'OAuthCredentialData',
};

export const oAuthDataNewMock = {
  clientId: 'clientId2',
  clientSecret: 'clientSecret2',
  url: 'https://test2',
};

export const apiPackageWithOAuthMock = {
  id: 'package-id',
  name: 'name',
  description: 'description',
  instanceAuthRequestInputSchema: '{}',
  defaultInstanceAuth: { credential: oAuthDataMock },
};

export const updateApiPackageWithOAuthMock = {
  request: {
    query: UPDATE_API_PACKAGE,
    variables: {
      id: 'package-id',
      in: {
        name: 'name',
        description: 'description',
        instanceAuthRequestInputSchema: '{}',
        defaultInstanceAuth: { credential: { oauth: oAuthDataNewMock } },
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

export const basicDataMock = {
  username: 'username',
  password: 'password',
  __typename: 'BasicCredentialData',
};

export const basicDataNewMock = {
  username: 'username2',
  password: 'password2',
};

export const apiPackageWithBasicMock = {
  id: 'package-id',
  name: 'name',
  description: 'description',
  instanceAuthRequestInputSchema: '{}',
  defaultInstanceAuth: { credential: basicDataMock },
};

export const updateApiPackageWithBasicMock = {
  request: {
    query: UPDATE_API_PACKAGE,
    variables: {
      id: 'package-id',
      in: {
        name: 'name',
        description: 'description',
        instanceAuthRequestInputSchema: '{}',
        defaultInstanceAuth: { credential: { basic: basicDataNewMock } },
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
        defaultInstanceAuth: null,
        package: {
          id: 'package-id',
          name: 'api-package-name-2',
          description: '',
          instanceAuthRequestInputSchema: '{}',
          instanceAuths: [],
          apiDefinitions: [],
          eventDefinitions: [],
        },
      },
    },
  },
};

export const jsonEditorMock = {
  setText: jest.fn(),
  destroy: jest.fn(),
  aceEditor: {
    setOption: jest.fn(),
  },
};
