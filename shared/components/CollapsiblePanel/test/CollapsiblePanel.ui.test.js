import React from 'react';
import renderer from 'react-test-renderer';
import { Button, Panel } from 'fundamental-react';
import { mount, shallow } from 'enzyme';

import { CollapsiblePanel } from './../CollapsiblePanel';

describe('Collapsible Panel', () => {
  it('Renders with minimal props (opened state)', () => {
    const component = renderer.create(
      <CollapsiblePanel
        children={<p>test</p>}
        title="Collapsible panel test"
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Renders in closed state', () => {
    const component = renderer.create(
      <CollapsiblePanel
        children={<p>test</p>}
        title="Collapsible panel test"
        isOpenInitially={false}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Applies custom class names to Panel', () => {
    const component = shallow(
      <CollapsiblePanel
        children={<p>test</p>}
        title="Collapsible panel"
        className="test-class-name"
      />,
    );
    expect(component.find(Panel).hasClass('test-class-name')).toBe(true);
  });

  it('Is initially closed when isOpenInitially is false', () => {
    const component = shallow(
      <CollapsiblePanel
        children={<p>test</p>}
        title="Collapsible panel"
        isOpenInitially={false}
      />,
    );

    expect(component.find(Panel.Body).hasClass('body body--closed')).toBe(true);
    expect(component.find(Panel.Body).hasClass('body body--open')).toBe(false);
  });

  it('Opens and closes', async () => {
    const exceptPanelVisible = (component, isVisible) => {
      const body = component.find(Panel.Body);
      expect(body.hasClass('body--closed')).toBe(!isVisible);
      expect(body.hasClass('body--open')).toBe(isVisible);
    };

    const child = <p>test</p>;
    const component = mount(
      <CollapsiblePanel children={child} title="Collapsible panel" />,
    );
    const button = component.find(Button);

    // initially opened
    exceptPanelVisible(component, true);

    // close
    button.simulate('click');
    await component.update();
    exceptPanelVisible(component, false);

    // open again
    button.simulate('click');
    await component.update();
    exceptPanelVisible(component, true);
  });
});
