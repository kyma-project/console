import { CREATE_OAUTH_CLIENT } from 'gql/mutations';

export const clientName = 'test-name';
export const namespace = 'test-namespace';
export const secretName = 'test-secret-name';

export const requestMock = {
  request: {
    query: CREATE_OAUTH_CLIENT,
    variables: {
      name: clientName,
      namespace,
      params: {
        secretName,
        scope: 'read',
        responseTypes: ['id_token'],
        grantTypes: ['client_credentials'],
      },
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      createOAuth2Client: {
        name: clientName,
      },
    },
  }),
};
