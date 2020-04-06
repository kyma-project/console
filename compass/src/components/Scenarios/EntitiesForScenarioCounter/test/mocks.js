import { GET_APPLICATIONS_FOR_SCENARIO } from 'components/Scenarios/gql';

const request = {
  query: GET_APPLICATIONS_FOR_SCENARIO,
  variables: {
    filter: [
      {
        key: 'scenarios',
        query: '$[*] ? (@ == "scenario" )',
      },
    ],
  },
};

export const validMock = {
  request,
  result: {
    data: {
      applications: {
        data: [],
        totalCount: 3,
      },
    },
  },
};

export const errorMock = {
  request,
  error: Error('sample error'),
};
