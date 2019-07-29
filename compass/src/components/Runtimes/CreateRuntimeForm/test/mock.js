import { GET_ALL_RUNTIME_NAMES } from '../../gql';
export const mocks = [
  {
    request: {
      query: GET_ALL_RUNTIME_NAMES,
    },
    result: {
      data: {
        dog: { id: '1', name: 'Buck', breed: 'bulldog' },
      },
    },
  },
];
