import { CONNECT_APPLICATION } from 'gql/mutations';

export const sampleData = {
  requestOneTimeTokenForApplication: {
    rawEncoded: 'sample raw encoded',
    legacyConnectorURL: 'sample legacy connector url',
  },
};

export const validMock = {
  request: {
    query: CONNECT_APPLICATION,
    variables: {
      id: 'app-id',
    },
  },
  result: {
    data: sampleData,
  },
};

export const errorMock = {
  request: {
    query: CONNECT_APPLICATION,
    variables: {
      id: 'app-id',
    },
  },
  error: Error('sample error'),
};
