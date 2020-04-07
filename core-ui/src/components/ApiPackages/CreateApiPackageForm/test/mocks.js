import { CREATE_API_PACKAGE } from 'gql/mutations';
import { GET_APPLICATION_COMPASS } from 'gql/queries';

export const apiPackageMock = {
  name: 'api-package-name',
  description: 'api-package-description',
  instanceAuthRequestInputSchema: '{}',
  defaultInstanceAuth: null,
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

export const createApiPackageMock = {
  request: {
    query: CREATE_API_PACKAGE,
    variables: {
      applicationId: 'app-id',
      in: apiPackageMock,
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

export const createApiPackageMockWithBasic = {
  request: {
    query: CREATE_API_PACKAGE,
    variables: {
      applicationId: 'app-id',
      in: {
        ...apiPackageMock,
        defaultInstanceAuth: { credential: { basic: basicCredentialsMock } },
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

export const createApiPackageMockWithOAuth = {
  request: {
    query: CREATE_API_PACKAGE,
    variables: {
      applicationId: 'app-id',
      in: {
        ...apiPackageMock,
        defaultInstanceAuth: { credential: { oauth: oAuthCredentialsMock } },
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
    query: GET_APPLICATION_COMPASS,
    variables: {
      id: 'app-id',
    },
  },
  result: {
    data: {
      application: {
        id: 'app-id',
        name: 'app-name',
        description: '',
        providerName: '',
        packages: [],
      },
    },
  },
};
