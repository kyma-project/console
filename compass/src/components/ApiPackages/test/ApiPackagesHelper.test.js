import {
  inferCredentialType,
  inferDefaultCredentials,
} from '../ApiPackagesHelpers';
import {
  CREDENTIAL_TYPE_NONE,
  CREDENTIAL_TYPE_OAUTH,
  CREDENTIAL_TYPE_BASIC,
  CREDENTIAL_TYPE_EMPTY,
} from 'react-shared';

describe('inferCredentialType', () => {
  const testCases = [
    [CREDENTIAL_TYPE_NONE, null],
    [CREDENTIAL_TYPE_EMPTY, { credential: null }],
    [
      CREDENTIAL_TYPE_OAUTH,
      { credential: { __typename: 'OAuthCredentialData' } },
    ],
    [
      CREDENTIAL_TYPE_BASIC,
      { credential: { __typename: 'BasicCredentialData' } },
    ],
  ];

  test.each(testCases)('case %s', (type, authData) =>
    expect(type).toBe(inferCredentialType(authData)),
  );
});

describe('inferDefaultCredentials', () => {
  const sampleCredentials = {
    credential: { a: 'b' },
  };

  const testCases = [
    [CREDENTIAL_TYPE_NONE, null],
    [CREDENTIAL_TYPE_EMPTY, null],
    [CREDENTIAL_TYPE_OAUTH, { oAuth: sampleCredentials.credential }],
    [CREDENTIAL_TYPE_BASIC, { basic: sampleCredentials.credential }],
  ];

  test.each(testCases)('case %s', (type, authData) =>
    expect(inferDefaultCredentials(type, sampleCredentials)).toEqual(authData),
  );
});
