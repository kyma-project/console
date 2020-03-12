import { CREATE_API_PACKAGE } from './../../gql';
import { GET_APPLICATION_COMPASS } from 'gql/queries';

export const createApiPackageMock = {
  request: {
    query: CREATE_API_PACKAGE,
    variables: {
      applicationId: 'app-id',
      in: {
        name: 'api-package-name',
        description: 'api-package-description',
        instanceAuthRequestInputSchema: '{}',
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
      },
    },
  },
};
