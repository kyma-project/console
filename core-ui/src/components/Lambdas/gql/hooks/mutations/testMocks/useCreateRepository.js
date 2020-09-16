import { CREATE_REPOSITORY } from 'components/Lambdas/gql/mutations';
import { TESTING_STATE } from 'components/Lambdas/helpers/testing';

export const createdRepository = {
  name: 'repository',
};

export const CREATE_REPOSITORY_ERROR_MOCK = variables => ({
  request: {
    query: CREATE_REPOSITORY,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const CREATE_REPOSITORY_DATA_MOCK = (
  variables,
  createGitRepository = createdRepository,
) => ({
  request: {
    query: CREATE_REPOSITORY,
    variables,
  },
  result: {
    data: {
      createGitRepository,
    },
  },
});
