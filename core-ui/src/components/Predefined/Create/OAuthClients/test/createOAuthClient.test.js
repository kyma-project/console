import { createOAuthClient } from '../createOAuthClient';

describe('createOAuthClient', () => {
  it('forms valid OAuth2 client', () => {
    const spec = {
      name: 'test-client',
      grantTypes: ['Grant', 'Michael', 'Jessica'],
      responseTypes: ['1'],
      secretName: 'test-secret-name',
      scope: 'a b',
    };
    expect(createOAuthClient('test-namespace', spec)).toMatchSnapshot();
  });
});
