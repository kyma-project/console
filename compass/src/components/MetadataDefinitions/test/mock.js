import { GET_LABEL_DEFINITIONS } from '../gql';

export const mocks = [
  {
    request: {
      query: GET_LABEL_DEFINITIONS,
    },
    result: {
      data: {
        labelDefinitions: [
          {
            key: 'testkey',
            schema: null,
          },
        ],
      },
    },
  },
];
