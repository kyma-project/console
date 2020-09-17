import React from 'react';
import { render } from '@testing-library/react';
import { useShowSystemNamespaces } from '../useShowSystemNamespaces.js';

let mockToggles = [];
jest.mock('@luigi-project/client', () => ({
  getActiveFeatureToggles: () => mockToggles,
}));

function TestComponent() {
  const showSystemNamespaces = useShowSystemNamespaces();
  return <p data-testid="value">{showSystemNamespaces.toString()}</p>;
}

describe('useShowSystemNamespaces', () => {
  it('Changes returned value during re-renders', () => {
    const { queryByTestId, rerender } = render(<TestComponent />);
    expect(queryByTestId('value')).toHaveTextContent('false');

    mockToggles = ['showSystemNamespaces'];

    rerender(<TestComponent />);
    expect(queryByTestId('value')).toHaveTextContent('true');

    mockToggles = ['anotherFeature'];

    rerender(<TestComponent />);
    expect(queryByTestId('value')).toHaveTextContent('false');
  });
});
