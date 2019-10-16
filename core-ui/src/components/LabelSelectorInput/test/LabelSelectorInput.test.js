import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';

import LabelSelectorInput, { Label, NonRemovableLabel } from '../LabelSelectorInput';

describe('LabelSelectorInput', () => {
  const mockChange = jest.fn();
  afterEach(() => {
    mockChange.mockReset();
  });
  it('Renders with minimal props', () => {
    const component = renderer.create(<LabelSelectorInput />);
    expect(component).toBeTruthy();
  });

  it('Renders readonly labels', () => {
    const component = shallow(
      <LabelSelectorInput readonlyLabels={['a', 'b']} />,
    );
    expect(component.find(NonRemovableLabel)).toMatchSnapshot();
  });

  it('Renders labels', () => {
    const component = shallow(<LabelSelectorInput labels={['a', 'b']} />);
    expect(component.find(Label)).toMatchSnapshot();
  });

  it(`Doesn't fire onChange with invalid label`, () => {
    const component = mount(<LabelSelectorInput onChange={mockChange} />);
    const input = component.find('input');

    input.instance().value = 'abc';
    input.simulate('keydown', { keyCode: 13 });

    expect(mockChange.mock.calls.length).toBe(0);
  });

  it(`Fires onChange when valid label is entered`, () => {
    const component = mount(<LabelSelectorInput onChange={mockChange} />);
    const input = component.find('input');

    input.instance().value = 'abc=def';
    input.simulate('keydown', { key: 'Enter' });

    expect(mockChange.mock.calls).toMatchSnapshot();
  });

  it(`Allows to remove labels`, () => {
    const component = mount(
      <LabelSelectorInput labels={['a=b', 'c=d']} onChange={mockChange} />,
    );

    component
      .find(Label)
      .first()
      .simulate('click');

    expect(mockChange.mock.calls).toMatchSnapshot();
  });

  it(`Doesn' allow to remove readonly labels`, () => {
    const component = mount(
      <LabelSelectorInput
        readonlyLabels={['a=b', 'c=d']}
        onChange={mockChange}
      />,
    );

    component
      .find(NonRemovableLabel)
      .first()
      .simulate('click');

    expect(mockChange.mock.calls.length).toBe(0);
  });
});
