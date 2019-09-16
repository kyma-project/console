import React from 'react';
import { mount } from 'enzyme';
import LabelsDisplay from '../LabelsDisplay';

describe('LabelsDisplay UI', () => {
  it('Clicking readonly label triggers callback', () => {
    const mockCallback = jest.fn();

    const component = mount(
      <LabelsDisplay
        labels={['a', 'b']}
        readonlyLabels={[]}
        removeLabel={mockCallback}
        removeAll={() => {}}
      />,
    );
    component
      .find('Token')
      .first()
      .simulate('click');
    expect(mockCallback).toHaveBeenNthCalledWith(1, 'a');
  });

  it('Clicking "Remove All" button triggers "removeAll" callback', () => {
    const mockCallback = jest.fn();
    const component = mount(
      <LabelsDisplay
        labels={['a', 'b']}
        readonlyLabels={['c', 'd']}
        removeLabel={() => {}}
        removeAll={mockCallback}
      />,
    );
    component.find('[data-test-id="clear-all"]').simulate('click');
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
