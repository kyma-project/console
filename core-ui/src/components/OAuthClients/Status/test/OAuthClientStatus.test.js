import React from 'react';
import { render } from '@testing-library/react';
import OAuthClientStatus from '../OAuthClientStatus';

describe('OAuthClientStatus', () => {
  it('renders "OK" status if there is no error', () => {
    const { queryByRole } = render(<OAuthClientStatus error={null} />);

    const status = queryByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent('OK');
  });

  it('renders error status if error is passed', () => {
    const error = {
      description: 'an error',
      code: 'ERROR',
    };
    const { queryByRole } = render(<OAuthClientStatus error={error} />);

    const status = queryByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent(error.code);
  });
});
