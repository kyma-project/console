import { mount } from 'enzyme';
import ServiceInstanceInfo from '../ServiceInstanceInfo';
import React from 'react';
import { serviceInstance1 } from './mocks';

describe('ServiceInstanceInfo', () => {
  it('Render info with all attributes', () => {
    const component = mount(
      <ServiceInstanceInfo serviceInstance={serviceInstance1} />,
    );
  });
  it('Render info without labels', () => {});
  it('Render info without support', () => {});
  it('Render info without documentation link', () => {});
  it('Render info without plan parameters', () => {});

  [
    { status: 'PROVISIONING', class: 'sys-help' },
    { status: 'FAILED', class: 'sys-cancel' },
    { status: 'RUNNING', class: 'sys-enter' },
  ].map(testCase => {
    it(`Render info with status ${testCase.status}`, () => {});
  });
});
