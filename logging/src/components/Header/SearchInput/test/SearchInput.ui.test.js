import React from 'react';
import { mount } from 'enzyme';
import SearchInput from '../SearchInput';

describe('MetadataDefinitionDetails UI', () => {
  it('Entering text triggers callback', async () => {
    const mockCallback = jest.fn();
    const component = mount(
      <SearchInput searchPhrase="" updateFilteringState={mockCallback} />,
    );
    component.find('.fd-input').simulate('change', { target: { value: 't' } });
    expect(mockCallback).toHaveBeenCalledWith({ searchPhrase: 't' });
  });
});
