import React from 'react';
import { mount } from 'enzyme';
import AutoRefreshButton from './../AutoRefreshButton';

describe('AutoRefreshButton UI', () => {
  it('Clicking button triggers callback', () => {
    const callbackMock = jest.fn();
    const component = mount(
      <AutoRefreshButton
        autoRefreshEnabled={false}
        updateParentState={callbackMock}
      />,
    );

    component.simulate('click');

    expect(callbackMock).toHaveBeenCalledTimes(1);
  });
});
