import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import NamespacesListHeader from '../NamespacesListHeader';

jest.mock('@kyma-project/luigi-client', () => ({
  getNodeParams: () => ({
    showModal: 'false',
  }),
  uxManager: () => ({
    addBackdrop: () => {},
    removeBackdrop: () => {},
  }),
  linkManager: () => ({
    navigate: () => {},
  }),
}));

describe('NamespacesListHeader', () => {
  it('Renders with minimal props', () => {
    const { queryByLabelText } = render(
      <NamespacesListHeader
        labelFilters={[]}
        updateSearchPhrase={() => {}}
        setLabelFilters={() => {}}
      />,
    );

    const title = queryByLabelText('title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Namespaces');
  });

  it('Fires callback on input field change', () => {
    const mockCallback = jest.fn();

    const { getByPlaceholderText } = render(
      <NamespacesListHeader
        labelFilters={[{ name: '1' }, { name: '2' }]}
        updateSearchPhrase={mockCallback}
        setLabelFilters={() => {}}
      />,
    );

    const input = getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'a' } });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('a');
  });
});
