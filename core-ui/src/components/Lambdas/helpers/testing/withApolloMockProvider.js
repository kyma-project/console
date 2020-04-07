import React from 'react';
import { MockedProvider } from '@apollo/react-testing';

export function withApolloMockProvider({
  component = null,
  mocks = [],
  otherProps = {},
}) {
  return (
    <MockedProvider mocks={mocks} addTypename={false} {...otherProps}>
      {component}
    </MockedProvider>
  );
}
