import { CONNECT_APPLICATION } from './../../../gql';

export const sampleData = {
  requestOneTimeTokenForApplication: {
    rawEncoded:
      'eyJ0b2tlbiI6IjZJWWkwal9ncjZxNWlsQWJvS1NoX2xFUzJaUFc1T29QTjlvMUsxYnZ2RlFkTXlkMVdQU3ExVjVnZF8yZkltelNydlNfdndOYl9FYzNLbkltWGE0US1RPT0iLCJjb25uZWN0b3JVUkwiOiJodHRwczovL2NvbXBhc3MtZ2F0ZXdheS5reW1hLmxvY2FsL2Nvbm5lY3Rvci9ncmFwaHFsIn0=',
    legacyConnectorURL:
      'https://adapter-gateway.kyma.local/v1/applications/signingRequests/info?token=6IYi0j_gr6q5ilAboKSh_lES2ZPW5OoPN9o1K1bvvFQdMyd1WPSq1V5gd_2fImzSrvS_vwNb_Ec3KnImXa4Q-Q==',
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
