import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import {
  serviceInstanceDeleteMutation,
  allServiceInstancesQuery,
  serviceInstancesSubscription,
} from '../../../testing/queriesMocks';
import ServiceInstancesTable from '../ServiceInstancesTable/ServiceInstancesTable.component';

import { Button, Spinner, Tab, Search } from '@kyma-project/react-components';
import ServiceInstancesList from '../ServiceInstancesList';
import { Link } from '../ServiceInstancesTable/styled.js';
import { createMockLink } from '../../../testing/apollo';
import { componentUpdate } from '../../../testing';
import { act } from 'react-dom/test-utils';
import { Counter } from 'fundamental-react';
import { serviceInstance1, serviceInstance3 } from 'testing/instanceMocks';
import FilterDropdown from '../ServiceInstancesToolbar/FilterDropdown.component';
import { FormInput } from '../ServiceInstancesToolbar/styled';

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

jest.mock('@kyma-project/luigi-client', () => ({
  linkManager: () => ({
    fromContext: () => ({
      navigate: mockNavigate,
      withParams: () => ({
        navigate: mockNavigate,
      }),
    }),
    withParams: () => ({
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
    expect(firstInstanceAnchor.text()).toEqual('sth-motherly-deposit');
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

  test.todo('Open modal for plan with non-empty spec');
  test.todo('No modal for plan with empty spec');
});

describe('Search instances by name', () => {
  const { link } = createMockLink([allServiceInstancesQuery]);
  const component = mount(
    <MockedProvider link={link}>
      <ServiceInstancesList />
    </MockedProvider>,
  );

  it('Shows all instances initially', async () => {
    await componentUpdate(component);

    const addOnsTab = component.find(Tab).at(0);
    expect(addOnsTab.find(Counter).text()).toEqual('2');

    const servicesTab = component.find(Tab).at(1);
    expect(servicesTab.find(Counter).text()).toEqual('1');
  });

  it('Search addon', async () => {
    await componentUpdate(component);

    const search = component.find(Search).find('input');
    expect(search.exists()).toBe(true);
    search.simulate('change', { target: { value: 'motherly' } });

    await componentUpdate(component);
    const addOnsTab = component.find(Tab).at(0);
    expect(addOnsTab.find(Counter).text()).toEqual('1');
    addOnsTab
      .find('div')
      .first()
      .simulate('click');
    await componentUpdate(component);
    expect(component.find(ServiceInstancesTable).prop('data')).toEqual([
      serviceInstance1,
    ]);

    const servicesTab = component.find(Tab).at(1);
    expect(servicesTab.find(Counter).text()).toEqual('0');

    servicesTab
      .find('div')
      .first()
      .simulate('click');
    await componentUpdate(component);
    expect(component.find(ServiceInstancesTable).prop('data')).toEqual([]);
  });

  it('Search service', async () => {
    await componentUpdate(component);

    const search = component.find(Search).find('input');
    expect(search.exists()).toBe(true);
    search.simulate('change', { target: { value: 'fishing' } });

    await componentUpdate(component);
    const addOnsTab = component.find(Tab).at(0);
    expect(addOnsTab.find(Counter).text()).toEqual('0');
    addOnsTab
      .find('div')
      .first()
      .simulate('click');
    await componentUpdate(component);
    expect(component.find(ServiceInstancesTable).prop('data')).toEqual([]);

    const servicesTab = component.find(Tab).at(1);
    expect(servicesTab.find(Counter).text()).toEqual('1');

    servicesTab
      .find('div')
      .first()
      .simulate('click');
    await componentUpdate(component);
    expect(component.find(ServiceInstancesTable).prop('data')).toEqual([
      serviceInstance3,
    ]);
  });
});

describe('filter instances by labels', () => {
  const { link } = createMockLink([allServiceInstancesQuery]);
  const component = mount(
    <MockedProvider link={link}>
      <ServiceInstancesList />
    </MockedProvider>,
  );

  it('Filter dropdown is filled with labels', async () => {
    await componentUpdate(component);
    const filter = component.find(FilterDropdown);
    expect(filter.prop('availableLabels')).toEqual({
      label1: 1,
      label2: 2,
      label3: 0,
    });

    const filterButton = filter.find('button[data-e2e-id="toggle-filter"]');
    filterButton.simulate('click');
    await componentUpdate(component);
    const labelsSelectors = component
      .find(FilterDropdown)
      .find(FormInput)
      .find('input');
    expect(labelsSelectors).toHaveLength(3);
  });

  it('Select filter', async () => {
    const firstLabelSelector = component
      .find(FilterDropdown)
      .find(FormInput)
      .find('input')
      .at(0);

    firstLabelSelector.simulate('change', {
      target: { checked: true, id: 'label1' },
    });
    await componentUpdate(component);
    expect(component.find(FilterDropdown).prop('activeLabelFilters')).toEqual([
      'label1',
    ]);

    const addOnsTab = component.find(Tab).at(0);
    expect(addOnsTab.find(Counter).text()).toEqual('1');

    addOnsTab
      .find('div')
      .first()
      .simulate('click');
    await componentUpdate(component);
    expect(component.find(ServiceInstancesTable).prop('data')).toEqual([
      serviceInstance1,
    ]);

    const servicesTab = component.find(Tab).at(1);
    expect(servicesTab.find(Counter).text()).toEqual('0');

    servicesTab
      .find('div')
      .first()
      .simulate('click');
    await componentUpdate(component);
    expect(component.find(ServiceInstancesTable).prop('data')).toEqual([]);
  });
});
