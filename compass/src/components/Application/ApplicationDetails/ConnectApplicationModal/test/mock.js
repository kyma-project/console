import { CONNECT_APPLICATION } from './../../../gql';

export const sampleData = {
  requestOneTimeTokenForApplication: {
    rawEncoded:
      'eyJ0b2tlbiI6IjZJWWkwal9ncjZxNWlsQWJvS1NoX2xFUzJaUFc1T29QTjlvMUsxYnZ2RlFkTXlkMVdQU3ExVjVnZF8yZkltelNydlNfdndOYl9FYzNLbkltWGE0US1RPT0iLCJjb25uZWN0b3JVUkwiOiJodHRwczovL2NvbXBhc3MtZ2F0ZXdheS5reW1hLmxvY2FsL2Nvbm5lY3Rvci9ncmFwaHFsIn0=',
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
