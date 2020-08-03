import { GET_SECRETS } from 'gql/queries';

export const namespace = 'test-namespace';

export const secretsMock = {
  request: {
    query: GET_SECRETS,
    variables: { namespace },
  },
  result: { data: { secrets: [{ name: 'secret-1' }, { name: 'secret-2' }] } },
};
