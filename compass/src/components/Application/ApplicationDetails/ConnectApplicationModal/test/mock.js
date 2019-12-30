import { CONNECT_APPLICATION } from './../../../gql';

export const sampleData = {
  requestOneTimeTokenForApplication: {
    token: 'sample token',
    connectorURL: 'sample connector url',
  },
};

export const validMock = [
  {
    request: {
      query: CONNECT_APPLICATION,
      variables: {
        id: 'app-id',
      },
    },
    result: {
      data: sampleData,
    },
  },
];

export const errorMock = [
  {
    request: {
      query: CONNECT_APPLICATION,
      variables: {
        id: 'app-id',
      },
    },
    error: Error('sample error'),
  },
];
