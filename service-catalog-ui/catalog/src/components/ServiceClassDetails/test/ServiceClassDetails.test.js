import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import {
  serviceClassQuery,
  mockEnvironmentId,
} from '../../../testing/queriesMocks';
import { clusterServiceClass1Name } from '../../../testing/serviceClassesMocks';
import ServiceClassDetails from '../ServiceClassDetails';
import { Spinner } from '@kyma-project/react-components';
import { componentUpdate } from '../../../testing';
import ServiceClassDetailsHeader from '../ServiceClassDetailsHeader/ServiceClassDetailsHeader.component';

const mockNavigate = jest.fn();
const mockAddBackdrop = jest.fn();
const mockRemoveBackdrop = jest.fn();

jest.mock('@kyma-project/generic-documentation', () => {
  return <div>GENERIC DOCUMENTATION COMPONENT</div>;
});

jest.mock('@kyma-project/luigi-client', () => ({
  getEventData: () => ({
    environmentId: mockEnvironmentId,
  }),
  linkManager: () => ({
    fromContext: () => ({
      navigate: mockNavigate,
    }),
  }),
  getNodeParams: () => ({
    selectedTab: 'addons',
  }),
  uxManager: () => ({
    addBackdrop: mockAddBackdrop,
    removeBackdrop: mockRemoveBackdrop,
  }),
}));

const consoleWarn = jest.spyOn(global.console, 'warn').mockImplementation();
afterAll(() => {
  consoleWarn.mockReset();
});

describe('Service Class Details UI', () => {
  it('Shows loading indicator only when data is not yet loaded', async () => {
    const component = mount(
      <MockedProvider mocks={[serviceClassQuery]}>
        <ServiceClassDetails name={clusterServiceClass1Name} />
      </MockedProvider>,
    );

    expect(component.find(Spinner).exists()).toBe(true);

    await componentUpdate(component);
    expect(component.find(Spinner).exists()).toBe(false);
  });

  it('Displays service class details ', async () => {
    const component = mount(
      <MockedProvider mocks={[serviceClassQuery]}>
        <ServiceClassDetails name={clusterServiceClass1Name} />
      </MockedProvider>,
    );
    await componentUpdate(component);
    await componentUpdate(component);

    expect(component.find(ServiceClassDetailsHeader).exists()).toBe(true);
  });
});
