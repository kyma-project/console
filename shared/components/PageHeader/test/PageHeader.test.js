import React from 'react';
import { render } from '@testing-library/react';

import { PageHeader } from '../PageHeader';

describe('PageHeader', () => {
  it('Renders title', () => {
    const { getByText } = render(<PageHeader title="page title" />);

    expect(getByText('page title')).toBeInTheDocument();
  });
});
