import { GET_APPLICATIONS } from '../gql';

export const MOCKED_DATA = {
  applications: {
    data: [
      {
        id: '44e98998-3da7-45c7-8f23-810d332fcb46',
        name: 'application1',
        description: 'description 1',
        labels: { label1: ['value1', 'value2'] },
        status: { condition: 'INITIAL', __typename: 'ApplicationStatus' },
        apis: { totalCount: 0, __typename: 'APIDefinitionPage' },
        eventAPIs: {
          totalCount: 0,
          __typename: 'EventAPIDefinitionPage',
        },
      },
      {
        id: '9363a5a3-632b-4148-9ca1-a16d08aeba28',
        name: 'application2',
        description: 'Lorem i32e23e23e23epsum',
        labels: { label2: ['value1', 'value2'] },
        status: { condition: 'INITIAL', __typename: 'ApplicationStatus' },
        apis: { totalCount: 0, __typename: 'APIDefinitionPage' },
        eventAPIs: {
          totalCount: 0,
          __typename: 'EventAPIDefinitionPage',
        },
        __typename: 'Application',
      },
    ],
    __typename: 'ApplicationPage',

    loading: false,
    error: undefined,
  },
};

export const GET_APPLICATIONS_MOCK = [
  {
    request: {
      query: GET_APPLICATIONS,
    },
    result: MOCKED_DATA,
  },
];
