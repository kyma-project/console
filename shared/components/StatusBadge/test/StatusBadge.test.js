import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { render } from '@testing-library/react';

describe('StatusBadge', () => {
  it('renders status text with proper role', () => {
    const { queryByRole } = render(<StatusBadge status="INITIAL" />);

    const status = queryByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent('INITIAL');
  });
});
