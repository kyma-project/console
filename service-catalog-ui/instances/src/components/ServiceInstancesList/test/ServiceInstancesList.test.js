import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import {
  serviceInstanceDeleteMutation,
  allServiceInstancesQuery,
  serviceInstancesSubscription,
} from '../../../testing/queriesMocks';
import ServiceInstancesTable from '../ServiceInstancesTable/ServiceInstancesTable.component';

import { Button, Spinner } from '@kyma-project/react-components';
import ServiceInstancesList from '../ServiceInstancesList';
import { Link } from '../ServiceInstancesTable/styled.js';
import { createMockLink } from '../../../testing/apollo';
import { componentUpdate } from '../../../testing';
import { act } from 'react-dom/test-utils';

const mockNavigate = jest.fn();
const mockAddBackdrop = jest.fn();
const mockRemoveBackdrop = jest.fn();

function mountWithModalBg(component) {
  return mount(
    <div className="modal-demo-bg">
      <span />
      {component}
    </div>,
    { attachTo: document.body },
  );
}

jest.mock('@kyma-project/luigi-client', () => {
  return {
    linkManager: function() {
      return {
        fromContext: function() {
          return {
            navigate: mockNavigate,
            withParams: () => {},
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

describe('InstancesList UI', () => {
  it('Shows loading indicator only when data is not yet loaded', async () => {
    const { link } = createMockLink([]);

    const component = mount(
      <MockedProvider link={link}>
        <ServiceInstancesList />
      </MockedProvider>,
    );

    expect(component.find(Spinner)).toHaveLength(1);

    await componentUpdate(component);

    expect(component.find(Spinner)).toHaveLength(0);
  });

  it('Displays instances with their corresponding names in the table', async () => {
    const { link } = createMockLink([allServiceInstancesQuery]);
    const component = mount(
      <MockedProvider link={link}>
        <ServiceInstancesList />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const table = component.find(ServiceInstancesTable);
    expect(table.exists()).toBe(true);

    const rowData = table.prop('data');
    expect(rowData).toHaveLength(2);

    const displayedInstanceLinks = table
      .find('[data-e2e-id="instance-name"]')
      .find(Link);
    expect(displayedInstanceLinks).toHaveLength(2);

    const firstInstanceAnchor = displayedInstanceLinks.at(0).find('a');
    const secondInstanceAnchor = displayedInstanceLinks.at(1).find('a');

    expect(firstInstanceAnchor.exists()).toBe(true);
    expect(secondInstanceAnchor.exists()).toBe(true);
    expect(firstInstanceAnchor.text()).toEqual('redis-motherly-deposit');
    expect(secondInstanceAnchor.text()).toEqual('testing-curly-tax');
  });

  it('Navigates to Service Catalog when clicked on "Add instance" button', async () => {
    const { link } = createMockLink([allServiceInstancesQuery]);
    const component = mount(
      <MockedProvider link={link}>
        <ServiceInstancesList />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const addInstanceButton = component
      .find('[data-e2e-id="add-instance"]')
      .find('button');
    expect(addInstanceButton.exists()).toBe(true);

    addInstanceButton.simulate('click');

    expect(mockNavigate).toHaveBeenCalledWith('cmf-service-catalog');
  });

  it('Navigates to Instance details when clicked on Instance link', async () => {
    const { link } = createMockLink([allServiceInstancesQuery]);
    const component = mount(
      <MockedProvider link={link}>
        <ServiceInstancesList />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const instanceLink = component
      .find('[data-e2e-id="instance-name-testing-curly-tax"]')
      .find('a');
    expect(instanceLink.exists()).toBe(true);

    instanceLink.simulate('click');

    expect(mockNavigate).toHaveBeenCalledWith(
      'cmf-instances/details/testing-curly-tax',
    );
  });

  it(`Test deleting instances via subscription`, async () => {
    const { link, sendEvent } = createMockLink([allServiceInstancesQuery]);
    const component = mount(
      <MockedProvider link={link}>
        <ServiceInstancesList />
      </MockedProvider>,
    );
    sendEvent(serviceInstancesSubscription('DELETE'));
    await componentUpdate(component);
    await componentUpdate(component);

    const table = component.find(ServiceInstancesTable);
    expect(table.exists()).toBe(true);
    expect(table.prop('data')).toHaveLength(1);
  });

  it(`Test adding instances via subscription`, async () => {
    const { link, sendEvent } = createMockLink([allServiceInstancesQuery]);
    const component = mount(
      <MockedProvider link={link}>
        <ServiceInstancesList />
      </MockedProvider>,
    );
    sendEvent(serviceInstancesSubscription('ADD'));
    await componentUpdate(component);
    await componentUpdate(component);

    const table = component.find(ServiceInstancesTable);
    expect(table.exists()).toBe(true);
    expect(table.prop('data')).toHaveLength(3);
  });

  it(`Validate if modal delete button fires deleteMutation`, async () => {
    const { link } = createMockLink([
      allServiceInstancesQuery,
      serviceInstanceDeleteMutation,
    ]);

    const deleteButtonSelector =
      'button[data-e2e-id="modal-confirmation-button"]';
    const component = mountWithModalBg(
      <MockedProvider link={link}>
        <ServiceInstancesList />
      </MockedProvider>,
    );
    await componentUpdate(component);

    const table = component.find(ServiceInstancesTable);
    expect(table.exists()).toBe(true);
    expect(table.prop('data')).toHaveLength(2);

    const displayedInstanceLinks = table.find('tr').find(Button);
    expect(displayedInstanceLinks).toHaveLength(2);

    const firstInstanceButton = displayedInstanceLinks.at(0).find('button');
    expect(firstInstanceButton.exists()).toBe(true);

    firstInstanceButton.simulate('click');

    const deleteButton = component.find(deleteButtonSelector);
    expect(deleteButton.exists()).toBe(true);

    await act(async () => {
      deleteButton.simulate('click');
    });
    await componentUpdate(component);

    expect(component.find(deleteButtonSelector).exists()).toBe(false);
    expect(serviceInstanceDeleteMutation.result).toHaveBeenCalled();
  });
});
