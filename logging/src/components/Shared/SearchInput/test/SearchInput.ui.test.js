import React from 'react';
import { mount } from 'enzyme';
import SearchInput from '../SearchInput';

describe('SearchInput UI', () => {
  it('Entering text triggers callback', async () => {
    const mockCallback = jest.fn();
    const component = mount(
      <SearchInput searchPhrase="" updateFilteringState={mockCallback} />,
    );
    component
      .find('#search-input')
      .simulate('change', { target: { value: 't' } });
    expect(mockCallback).toHaveBeenNthCalledWith(1, { searchPhrase: 't' });
  });
});
