import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import {
  serviceInstanceDeleteMutation,
  serviceInstanceQuery,
  createBindingMutation,
} from '../../../testing/networkMock';
import ServiceInstanceDetails from '../ServiceInstanceDetails';
import { Spinner, Toolbar, Modal } from '@kyma-project/react-components';
import { createMockLink } from '../../../testing/apollo';
import { componentUpdate } from '../../../testing';
import { serviceInstanceConstants } from '../../../variables';

import ServiceInstanceHeader from '../ServiceInstanceHeader/ServiceInstanceHeader.component';
import ServiceInstanceBindings from '../ServiceInstanceBindings/ServiceInstanceBindings.container';
import NotificationContext from '../../../contexts/NotificationContext/NotificationContext';

const mockNavigate = jest.fn();
const mockAddBackdrop = jest.fn();
const mockRemoveBackdrop = jest.fn();

jest.mock('@kyma-project/generic-documentation', () => {
  return <div>GENERIC DOCUMENTATION COMPONENT</div>;
});

jest.mock('@kyma-project/luigi-client', () => {
  return {
    linkManager: function() {
      return {
        fromContext: function() {
          return {
            navigate: mockNavigate,
          };
        },
      };
    },
    getNodeParams: function() {
      return {
        selectedTab: 'addons',
      };
    },
    uxManager: function() {
      return {
        addBackdrop: mockAddBackdrop,
        removeBackdrop: mockRemoveBackdrop,
      };
    },
  };
});

describe('Instance Details UI', () => {
  it('Shows loading indicator only when data is not yet loaded', async () => {
    const { link } = createMockLink([serviceInstanceQuery]);

    const component = mount(
      <MockedProvider link={link}>
        <ServiceInstanceDetails
          match={{
            params: {
              name: 'redis-motherly-deposit',
            },
          }}
        />
      </MockedProvider>,
    );

    expect(component.find(Spinner).exists()).toBe(true);

    await componentUpdate(component);

    expect(component.find(Spinner).exists()).toBe(false);
  });

  it('Displays instance details ', async () => {
    const { link } = createMockLink([serviceInstanceQuery]);

    const component = mount(
      <MockedProvider link={link}>
        <ServiceInstanceDetails
          match={{
            params: {
              name: 'redis-motherly-deposit',
            },
          }}
        />
      </MockedProvider>,
    );

    await componentUpdate(component);

    expect(component.find(ServiceInstanceHeader).exists()).toBe(true);
    expect(component.find(ServiceInstanceBindings).exists()).toBe(true);

    const toolbar = component.find(Toolbar);
    expect(toolbar.text()).toMatch(/redis-motherly-deposit/);
  });

  it('Deletes instance using delete button', async () => {
    const { link } = createMockLink([
      serviceInstanceQuery,
      serviceInstanceDeleteMutation,
    ]);

    const component = mount(
      <MockedProvider link={link}>
        <ServiceInstanceDetails
          match={{
            params: {
              name: 'redis-motherly-deposit',
            },
          }}
        />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const header = component.find(ServiceInstanceHeader);
    const deleteButton = header.find('button');

    expect(deleteButton.exists()).toBe(true);
    expect(deleteButton.text()).toBe(serviceInstanceConstants.delete);

    deleteButton.simulate('click');
    await componentUpdate(component);

    const deleteModal = component.find(Toolbar).find(Modal);
    expect(deleteModal.exists()).toBe(true);

    expect(deleteModal.text()).toMatch(
      new RegExp(serviceInstanceConstants.delete),
    );

    const confirmDeleteButton = deleteModal
      .find('button')
      .find('[data-e2e-id="modal-confirmation-button"]');
    expect(confirmDeleteButton.exists()).toBe(true);

    const deleteMutation = serviceInstanceDeleteMutation.result;
    confirmDeleteButton.simulate('click');
    await componentUpdate(component);
    expect(deleteMutation).toHaveBeenCalledTimes(1);
  });

  it('Creates credentials', async () => {
    const { link } = createMockLink([
      serviceInstanceQuery,
      createBindingMutation,
    ]);

    const component = mount(
      <MockedProvider link={link}>
        <NotificationContext.Provider
          value={{ isOpen: false, open: jest.fn() }}
        >
          <ServiceInstanceDetails
            match={{
              params: {
                name: 'redis-motherly-deposit',
              },
            }}
          />
        </NotificationContext.Provider>
      </MockedProvider>,
    );

    await componentUpdate(component);

    const credentialsTab = component.find(
      '[data-e2e-id="service-binding-tab"]',
    );
    expect(credentialsTab.exists()).toBe(true);

    credentialsTab.simulate('click');
    await componentUpdate(component);

    const createCredentialsButton = component
      .find('[data-e2e-id="create-credentials"]')
      .find('button');

    expect(createCredentialsButton.exists()).toBe(true);

    const createBindingFn = createBindingMutation.result;
    createCredentialsButton.simulate('click');
    await componentUpdate(component);

    expect(createBindingFn).toHaveBeenCalledTimes(1);
  });
});
