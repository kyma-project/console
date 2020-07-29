import { GET_SECRET } from 'gql/queries';

export const namespace = 'test-namespace';
export const name = 'test-name';

export const secret = {
  data: {
    client_id: 'client-id',
    client_secret: 'client-secret',
  },
};

const request = {
  query: GET_SECRET,
  variables: { namespace, name },
};

export const successMock = {
  request,
  result: { data: { secret } },
};

export const errorMock = {
  request,
  error: Error('test-error'),
};

export const invalidSecretMock = {
  request,
  result: { data: { secret: { data: {} } } },
};
