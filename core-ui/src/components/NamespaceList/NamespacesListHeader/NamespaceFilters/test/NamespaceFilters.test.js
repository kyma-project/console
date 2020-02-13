import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import NamespaceFilters from './../NamespaceFilters';

describe('NamespaceFilters', () => {
  it('Renders search labels', () => {
    //for Popovers's Warning: `NaN` is an invalid value for the `left` css style property.
    console.error = jest.fn();

    const { queryByText, queryByLabelText } = render(
      <NamespaceFilters
        filters={[{ name: 'first-label' }, { name: 'second-label' }]}
        updateFilters={() => {}}
      />,
    );

    const labelsButton = queryByLabelText('open-filters');
    expect(labelsButton).toBeInTheDocument();
    fireEvent.click(labelsButton);

    ['first-label', 'second-label'].forEach(name =>
      expect(queryByText(name)).toBeInTheDocument(),
    );
  });
});
