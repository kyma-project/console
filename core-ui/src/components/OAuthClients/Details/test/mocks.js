import { GET_SECRET, GET_OAUTH_CLIENT } from 'gql/queries';

export const namespace = 'test-namespace';
export const name = 'test-name';
export const secretName = 'test-secret-name';

const clientQueryMock = {
  request: {
    query: GET_OAUTH_CLIENT,
    variables: { namespace, name },
  },
  result: {
    data: {
      oAuth2Client: {
        name,
        namespace,
        generation: 2,
        error: null,
        spec: {
          grantTypes: [],
          responseTypes: [],
          scope: '',
          secretName,
        },
      },
    },
  },
};

const secretQueryMock = {
  request: {
    query: GET_SECRET,
    variables: { namespace, name: secretName },
  },
  result: { data: { secret: null } },
};

export const requestMocks = [clientQueryMock, secretQueryMock];
