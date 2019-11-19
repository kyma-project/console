import renderer from 'react-test-renderer';
import React from 'react';
import { InstancesIndicator } from '../InstancesIndicator';

describe('InstancesIndicator', () => {
  it('Renders without instances and provision only once', () => {
    const component = renderer.create(
      <InstancesIndicator
        numberOfInstances={0}
        labels={{ provisionOnlyOnce: 'true', local: 'true' }}
      />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Renders with instances and provision only once', () => {
    const component = renderer.create(
      <InstancesIndicator
        numberOfInstances={1}
        labels={{ provisionOnlyOnce: 'true', local: 'true' }}
      />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Renders without instances and no provision only once', () => {
    const component = renderer.create(
      <InstancesIndicator numberOfInstances={0} labels={{ local: 'true' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Renders with instances and no provision only once', () => {
    const component = renderer.create(
      <InstancesIndicator numberOfInstances={3} labels={{ local: 'true' }} />,
    );
    expect(component).toMatchSnapshot();
  });
});
