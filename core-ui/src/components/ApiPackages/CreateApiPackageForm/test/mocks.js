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
