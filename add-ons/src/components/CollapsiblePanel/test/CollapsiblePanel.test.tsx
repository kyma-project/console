import React from 'react';
import CollapsiblePanel from './../CollapsiblePanel';
import { Panel } from 'fundamental-react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('CollapsiblePanel', () => {
  it('Renders with minimal props', () => {
    const component = shallow(
      <CollapsiblePanel
        children={<p>child</p>}
        title="Collapsible Panel"
        setIsOpen={jest.fn()}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Renders with custom prop: isOpen = true', () => {
    const component = shallow(
      <CollapsiblePanel
        children={<p>child</p>}
        title="Collapsible Panel"
        setIsOpen={jest.fn()}
        isOpen={true}
      />,
    );
    expect(component.exists('.body--open')).toBe(true);
    expect(component.exists('.body--closed')).toBe(false);
  });

  it('Renders with custom prop: actions', () => {
    const component = shallow(
      <CollapsiblePanel
        children={<p>child</p>}
        title="Collapsible Panel"
        setIsOpen={jest.fn()}
        actions={<p id="custom-action" />}
      />,
    );
    expect(component.exists('#custom-action')).toBe(true);
  });

  it('Renders with custom prop: additionalHeaderContent', () => {
    const component = shallow(
      <CollapsiblePanel
        children={<p>child</p>}
        title="Collapsible Panel"
        setIsOpen={jest.fn()}
        actions={<p id="additional-header-content" />}
      />,
    );
    expect(component.exists('#additional-header-content')).toBe(true);
  });

  it('Renders with custom prop: className', () => {
    const component = shallow(
      <CollapsiblePanel
        children={<p>child</p>}
        title="Collapsible Panel"
        setIsOpen={jest.fn()}
        className="custom-class-name"
      />,
    );
    expect(component.find(Panel).hasClass('custom-class-name')).toBe(true);
  });
});
