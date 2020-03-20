import { UPDATE_APPLICATION } from '../../../gql';

export const applicationMock = {
  id: '1',
  name: 'app',
  providerName: 'provider',
  description: 'desc',
  healthCheckURL: 'http://healthCheckURL',
  integrationSystemID: 'intsys',
};

export const validApplicationUpdateMock = {
  request: {
    query: UPDATE_APPLICATION,
    variables: {
      id: '1',
      in: {
        providerName: 'new-provider',
        description: 'new-desc',
        healthCheckURL: 'http://healthCheckURL',
        integrationSystemID: 'intsys',
      },
    },
  },
  result: {
    data: {
      updateApplication: {
        id: '1',
        name: 'app',
        providerName: 'new-provider',
      },
    },
  },
};

export const invalidApplicationUpdateMock = {
  request: {
    query: UPDATE_APPLICATION,
    variables: {
      id: '1',
      in: {
        providerName: 'new-provider',
        description: 'new-desc',
        healthCheckURL: 'http://healthCheckURL',
        integrationSystemID: 'intsys',
      },
    },
  },
  error: new Error('Query error'),
};
