import { render } from 'enzyme';
import React from 'react';
import { InstancesIndicator } from '../InstancesIndicator';

const consoleWarn = jest.spyOn(global.console, 'warn').mockImplementation();
afterAll(() => {
  consoleWarn.mockReset();
});

describe('InstancesIndicator', () => {
  it('Renders without instances and provision only once', () => {
    const component = render(
      <InstancesIndicator
        numberOfInstances={0}
        labels={{ provisionOnlyOnce: 'true', local: 'true' }}
      />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Renders with instances and provision only once', () => {
    const component = render(
      <InstancesIndicator
        numberOfInstances={1}
        labels={{ provisionOnlyOnce: 'true', local: 'true' }}
      />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Renders without instances and no provision only once', () => {
    const component = render(
      <InstancesIndicator numberOfInstances={0} labels={{ local: 'true' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Renders with instances and no provision only once', () => {
    const component = render(
      <InstancesIndicator numberOfInstances={3} labels={{ local: 'true' }} />,
    );
    expect(component).toMatchSnapshot();
  });
});
