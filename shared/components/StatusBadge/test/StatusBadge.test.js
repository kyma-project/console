import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { render } from '@testing-library/react';

describe('StatusBadge', () => {
  it('renders status text with proper role', () => {
    const { queryByRole } = render(<StatusBadge>INITIAL</StatusBadge>);

    const status = queryByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent('INITIAL');
  });

  it('displays warning when autoResolveType is set and "children" is a node', () => {
    console.warn = jest.fn();

    render(
      <StatusBadge autoResolveType>
        <small>Status</small>
      </StatusBadge>,
    );

    expect(console.warn.mock.calls[0]).toMatchSnapshot();
  });
});
