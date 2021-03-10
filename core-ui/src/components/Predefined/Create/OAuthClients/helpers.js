export const grantTypes = {
  client_credentials: 'Client credentials',
  authorization_code: 'Authorization code',
  implicit: 'Implicit',
  refresh_token: 'Refresh token',
};

export const responseTypes = {
  id_token: 'ID token',
  code: 'Code',
  token: 'Token',
};

export function validateSpec(spec) {
  const { grantTypes, responseTypes, scope } = spec;
  return grantTypes.length >= 1 && responseTypes.length >= 1 && !!scope;
}

export const emptySpec = {
  name: '',
  scope: '',
  responseTypes: [],
  grantTypes: [],
  secretName: '',
};
