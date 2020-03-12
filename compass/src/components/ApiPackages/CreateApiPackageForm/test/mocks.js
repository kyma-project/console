import { CREATE_API_PACKAGE } from './../../gql';
import { GET_APPLICATION } from 'components/Application/gql';

export const createApiPackageMock = {
  request: {
    query: CREATE_API_PACKAGE,
    variables: {
      applicationId: 'app-id',
      in: {
        name: 'api-package-name',
        description: 'api-package-description',
        instanceAuthRequestInputSchema: '{}',
        defaultInstanceAuth: null,
      },
    },
  },
  result: {
    data: {
      addPackage: {
        name: 'package',
      },
    },
  },
};

export const oAuthDataMock = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  url: 'https://test',
};

export const createApiPackageWithOAuthMock = {
  request: {
    query: CREATE_API_PACKAGE,
    variables: {
      applicationId: 'app-id',
      in: {
        name: 'api-package-name',
        description: 'api-package-description',
        instanceAuthRequestInputSchema: '{}',
        defaultInstanceAuth: { credential: { oauth: oAuthDataMock } },
      },
    },
  },
  result: {
    data: {
      addPackage: {
        name: 'package',
      },
    },
  },
};

export const basicDataMock = {
  username: 'username',
  password: 'password',
};

export const createApiPackageWithBasicMock = {
  request: {
    query: CREATE_API_PACKAGE,
    variables: {
      applicationId: 'app-id',
      in: {
        name: 'api-package-name',
        description: 'api-package-description',
        instanceAuthRequestInputSchema: '{}',
        defaultInstanceAuth: { credential: { basic: basicDataMock } },
      },
    },
  },
  result: {
    data: {
      addPackage: {
        name: 'package',
      },
    },
  },
};

export const refetchApiPackageMock = {
  request: {
    query: GET_APPLICATION,
    variables: {
      id: 'app-id',
    },
  },
  result: {
    data: {
      application: {
        id: 'app-id',
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
