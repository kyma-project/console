import { CREATE_RESOURCE } from 'gql/mutations';

export const namespace = 'test-namespace';

export const successRequestMock = {
  request: {
    query: CREATE_RESOURCE,
    variables: {
      namespace,
      resource: {
        kind: 'test',
        metadata: { namespace },
      },
    },
  },
  result: jest.fn().mockReturnValue({
    data: { createResource: { id: 1 } },
  }),
};

export const failureRequestMock = {
  request: {
    query: CREATE_RESOURCE,
    variables: {
      namespace,
      resource: {
        kind: 'test',
        metadata: { namespace },
      },
    },
  },
  error: Error('test error'),
};
