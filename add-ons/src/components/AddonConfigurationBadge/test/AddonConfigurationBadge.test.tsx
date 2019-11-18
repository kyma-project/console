import React from 'react';
import AddonConfigurationBadge from './../AddonConfigurationBadge';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Badge } from 'fundamental-react';

describe('AddonConfigurationBadge', () => {
  it('Renders in success state for "ready" status', () => {
    const component = mount(<AddonConfigurationBadge status="ready" />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Renders in error state for status "failed"', () => {
    const component = mount(<AddonConfigurationBadge status="failed" />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Renders in warning state for custom status', () => {
    const component = mount(<AddonConfigurationBadge status="other" />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Applies custom class name', () => {
    const component = mount(
      <AddonConfigurationBadge status="ready" className="custom-class-name" />,
    );
    expect(component.find(Badge).hasClass('custom-class-name')).toBe(true);
  });
});
