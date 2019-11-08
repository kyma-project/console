import { GET_APPLICATIONS, UPDATE_APPLICATION } from '../../../gql';

export const applicationMock = {
  name: 'app1',
  description: 'desc1',
  healthCheckURL: 'http://healthCheckURL',
};

export const validApplicationsQueryMock = {
  request: {
    query: GET_APPLICATIONS,
  },
  result: {
    data: {
      applications: {
        data: [
          {
            id: '1',
            name: 'app1',
            description: 'desc1',
          },
          {
            id: '2',
            name: 'app2',
            description: 'desc2',
          },
        ],
      },
    },
  },
};

export const invalidApplicationsQueryMock = {
  request: {
    query: GET_APPLICATIONS,
  },
  error: new Error('Query error'),
};
