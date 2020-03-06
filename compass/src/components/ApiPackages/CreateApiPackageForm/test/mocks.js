import { CREATE_API_PACKAGE } from './../../gql';

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

export const jsonEditorMock = {
  setText: jest.fn(),
  destroy: jest.fn(),
};
