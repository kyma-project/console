import React from 'react';
import { render } from '@testing-library/react';

import { ServiceBindingsService } from '../ServiceBindingsService';

describe('ServiceBindingsService', () => {
  it('Render with minimal props', () => {
    const { queryByText, getByText } = render(
      <ServiceBindingsService lambdaName="foobar">
        <div>foobar</div>
      </ServiceBindingsService>,
    );

    expect(getByText('foobar')).toBeInTheDocument();
    expect(queryByText('foo-bar')).not.toBeInTheDocument();
  });
});
