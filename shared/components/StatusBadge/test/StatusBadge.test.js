import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { render } from '@testing-library/react';

describe('StatusBadge', () => {
  it('renders status text', () => {
    const { queryByText } = render(<StatusBadge status="INITIAL" />);

    expect(queryByText('INITIAL')).toBeInTheDocument();
  });

  it('displays help cursor when tooltip content is set', () => {
    const { getByRole } = render(
      <StatusBadge status="INITIAL">some content</StatusBadge>,
    );
    expect(getByRole('status')).toHaveStyle(`cursor: help`);
  });
});
