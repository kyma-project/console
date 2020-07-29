import React from 'react';
import { render } from '@testing-library/react';
import OAuthClientSpecPanel from '../OAuthClientSpecPanel';

describe('OAuthClientSpecPanel', () => {
  it('Renders with minimal props', () => {
    const spec = {
      grantTypes: ['client_credentials', 'refresh_token'],
      responseTypes: ['id_token', 'token'],
      scope: 'write read',
    };
    const { queryByText } = render(<OAuthClientSpecPanel spec={spec} />);

    expect(queryByText('Client credentials')).toBeInTheDocument();
    expect(queryByText('Refresh token')).toBeInTheDocument();

    expect(queryByText('ID token')).toBeInTheDocument();
    expect(queryByText('Token')).toBeInTheDocument();

    expect(queryByText('write')).toBeInTheDocument();
    expect(queryByText('read')).toBeInTheDocument();
  });
});
