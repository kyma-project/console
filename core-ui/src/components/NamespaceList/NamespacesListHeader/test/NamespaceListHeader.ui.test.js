import React from 'react';
import { mount } from 'enzyme';

import NamespacesListHeader from './../NamespacesListHeader';

jest.mock('@kyma-project/luigi-client', () => ({
  getNodeParams: () => ({
    showModal: 'false',
  }),
  uxManager: () => ({
    addBackdrop: () => {},
    removeBackdrop: () => {},
  }),
}));

describe('NamespacesListHeader', () => {
  it('Renders with minimal props', () => {
    const mockCallback = jest.fn();

    const component = mount(
      <NamespacesListHeader
        labelFilters={[{ name: '1' }, { name: '2' }]}
        updateSearchPhrase={mockCallback}
        setLabelFilters={() => {}}
      />,
    );

    const input = component.find(
      '[data-test-id="namespace-seach-input"] input',
    );
    input.simulate('change', { target: { value: 'a' } });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('a');
  });
});
