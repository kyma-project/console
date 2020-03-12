import { UPDATE_API_PACKAGE, GET_API_PACKAGE } from './../../../gql';

export const apiPackageMock = {
  id: 'package-id',
  name: 'api-package-1',
  description: 'desc',
  instanceAuthRequestInputSchema: '{}',
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
        },
      },
    },
  },
};
