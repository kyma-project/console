import { GET_LABEL_DEFINITION, UPDATE_LABEL_DEFINITION } from '../../gql';

export const mocks = [
  {
    request: {
      query: GET_LABEL_DEFINITION,
      variables: {
        key: 'noschemalabel',
      },
    },
    result: {
      data: {
        labelDefinition: {
          key: 'testkey',
          schema: null,
        },
      },
    },
  },
  {
    request: {
      query: GET_LABEL_DEFINITION,
      variables: {
        key: 'labelWithInvalidSchema',
      },
    },
    result: {
      data: {
        labelDefinition: {
          key: 'testkey',
          schema: { thisSchema: "has no 'properties' key" },
        },
      },
    },
  },

  {
    request: {
      query: UPDATE_LABEL_DEFINITION,
      variables: {
        in: { key: 'testkey', schema: null },
      },
    },
    result: jest.fn().mockReturnValue({
      data: {
        updateLabelDefinition: {
          key: 'testkey',
          schema: null,
        },
      },
    }),
  },
];
