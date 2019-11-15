import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import {
  allServiceClassesQuery,
  mockEnvironmentId,
} from '../../../testing/queriesMocks';
import { clusterServiceClass1Name } from '../../../testing/serviceClassesMocks';
import { Spinner, Tab } from '@kyma-project/react-components';
import ServiceClassList from '../ServiceClassList';
import { componentUpdate } from '../../../testing';

const mockNavigate = jest.fn();

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => {
      return {
        environmentId: mockEnvironmentId,
      };
    },
    linkManager: function() {
      return {
        fromClosestContext: function() {
          return {
            navigate: mockNavigate,
          };
        },
        withParams: function() {
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
  };
});

describe('ServiceClassList UI', () => {
  it('Shows loading indicator only when data is not yet loaded', async () => {
    const component = mount(
      <MockedProvider mocks={[]}>
        <ServiceClassList />
      </MockedProvider>,
    );

    expect(component.find(Spinner)).toHaveLength(1);

    await componentUpdate(component);

    expect(component.find(Spinner)).toHaveLength(0);
  });

  it('Displays classes with their corresponding names on the add-ons/services list', async () => {
    const component = mount(
      <MockedProvider mocks={[allServiceClassesQuery]}>
        <ServiceClassList />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const addonsCards = component.find('.fd-tile__title');

    expect(addonsCards.exists()).toBe(true);
    expect(addonsCards).toHaveLength(2);
    expect(addonsCards.at(0).text()).toEqual(
      allServiceClassesQuery.result.data.clusterServiceClasses[0].displayName,
    );
    expect(addonsCards.at(1).text()).toEqual(
      allServiceClassesQuery.result.data.clusterServiceClasses[1].displayName,
    );

    component
      .find(Tab)
      .at(1)
      .find('div')
      .first()
      .simulate('click');

    await componentUpdate(component);

    const servicesCards = component.find('.fd-tile__title');

    expect(servicesCards.exists()).toBe(true);
    expect(servicesCards).toHaveLength(1);

    expect(servicesCards.at(0).text()).toEqual(
      allServiceClassesQuery.result.data.serviceClasses[0].displayName,
    );
  });

  it('Navigates to Service Catalog details', async () => {
    const component = mount(
      <MockedProvider mocks={[allServiceClassesQuery]}>
        <ServiceClassList />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const goToDetails = component
      .find('[data-e2e-id="go-to-details"]>div')
      .at(0);

    expect(goToDetails.exists()).toBe(true);
    goToDetails.simulate('click');

    await componentUpdate(component);

    expect(mockNavigate).toHaveBeenCalledWith(
      `details/${clusterServiceClass1Name}`,
    );
  });
});
