import { REGISTER_APPLICATION } from '../../../../gql/mutations';
import { CHECK_APPLICATION_EXISTS } from '../../../../gql/queries';

const DEFAULT_SCENARIO_LABEL = 'DEFAULT';
const application = {
  name: 'testname',
  providerName: '',
  description: '',
  labels: {
    scenarios: [DEFAULT_SCENARIO_LABEL],
  },
};

export const registerApplicationSuccessfulMock = () => {
  return {
    request: {
      query: REGISTER_APPLICATION,
      variables: { in: application },
    },
    result: jest.fn().mockReturnValue({
      data: {
        registerApplication: {
          name: application.name,
          id: 'abcd',
        },
      },
    }),
  };
};

export const registerApplicationErrorMock = () => ({
  request: {
    query: REGISTER_APPLICATION,
    variables: { in: application },
  },
  error: new Error('Application already exists'),
});
