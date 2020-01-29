import React from 'react';
import { DetailsError } from '../DetailsError';

import { render } from '@testing-library/react';

describe('DetailsError', () => {
  it('Renders breadcrumbs and message', () => {
    const breadcrumbs = [
      { name: 'test-1', path: '/' },
      { name: 'test-2', path: '/test' },
    ];
    const message = 'Error';

    const { queryByText } = render(
      <DetailsError breadcrumbs={breadcrumbs} message={message} />,
    );

    expect(queryByText(message)).toBeInTheDocument();
    expect(queryByText(breadcrumbs[0].name)).toBeInTheDocument();
    expect(queryByText(breadcrumbs[1].name)).toBeInTheDocument();
  });
});
