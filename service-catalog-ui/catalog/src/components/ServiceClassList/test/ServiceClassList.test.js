import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import {
  allServiceClassesQuery,
  mockEnvironmentId,
  moreThanAllServiceClassesQuery,
} from '../../../testing/queriesMocks';
import {
  clusterServiceClass1Name,
  clusterServiceClass3,
  clusterServiceClass1,
  serviceClass1,
} from '../../../testing/serviceClassesMocks';
import { Spinner, Tab } from '@kyma-project/react-components';
import ServiceClassList from '../ServiceClassList';
import { componentUpdate } from '../../../testing';
import { Search } from '@kyma-project/react-components';
import { Counter } from 'fundamental-react';
import Cards from '../Cards/Cards.component';

const mockNavigate = jest.fn();

jest.mock('@kyma-project/luigi-client', () => ({
  getEventData: () => ({
    environmentId: mockEnvironmentId,
  }),
  linkManager: () => ({
    fromClosestContext: () => ({
      navigate: mockNavigate,
    }),
    withParams: () => ({
      navigate: mockNavigate,
    }),
  }),
  getNodeParams: () => ({
    selectedTab: 'addons',
  }),
}));

const consoleWarn = jest.spyOn(global.console, 'warn').mockImplementation();
afterAll(() => {
  consoleWarn.mockReset();
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

    expectKnownConsoleWarnings();
  });

  it('Displays classes with their corresponding names on the add-ons/services list', async () => {
    const component = mount(
      <MockedProvider mocks={[allServiceClassesQuery]}>
        <ServiceClassList />
      </MockedProvider>,
    );

    await componentUpdate(component);

    expect(
      component
        .find(Tab)
        .at(0)
        .find(Counter)
        .text(),
    ).toEqual('2');
    expect(
      component
        .find(Tab)
        .at(1)
        .find(Counter)
        .text(),
    ).toEqual('1');

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

    expectKnownConsoleWarnings();
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

    expectKnownConsoleWarnings();
  });
});

describe('Search classes by name', () => {
  const component = mount(
    <MockedProvider mocks={[moreThanAllServiceClassesQuery]}>
      <ServiceClassList />
    </MockedProvider>,
  );

  it('Set search text', async () => {
    await componentUpdate(component);
    const search = component.find(Search).find('input');
    expect(search.exists()).toBe(true);
    search.simulate('change', { target: { value: 'displayName1' } });

    expectKnownConsoleWarnings();
  });

  it('Add-Ons tab has proper counter', async () => {
    await componentUpdate(component);
    const addOnsTab = component.find(Tab).at(0);
    expect(addOnsTab.find(Counter).text()).toEqual('2');

    expectKnownConsoleWarnings();
  });

  it('Add-Ons tab shows only matching items', async () => {
    const addOnsTab = component.find(Tab).at(0);
    addOnsTab
      .find('div')
      .first()
      .simulate('click');
    await componentUpdate(component);
    expect(component.find(Cards).prop('items')).toEqual([
      clusterServiceClass1,
      clusterServiceClass3,
    ]);

    expectKnownConsoleWarnings();
  });

  it('Services tab has proper counter', () => {
    const servicesTab = component.find(Tab).at(1);
    expect(servicesTab.find(Counter).text()).toEqual('1');

    expectKnownConsoleWarnings();
  });

  it('Services tab shows only matching items', async () => {
    const servicesTab = component.find(Tab).at(1);
    servicesTab
      .find('div')
      .first()
      .simulate('click');
    await componentUpdate(component);
    expect(component.find(Cards).prop('items')).toEqual([serviceClass1]);

    expectKnownConsoleWarnings();
  });
});

describe('Search classes by other attributes', () => {
  const component = mount(
    <MockedProvider mocks={[moreThanAllServiceClassesQuery]}>
      <ServiceClassList />
    </MockedProvider>,
  );

  it('By provider', async () => {
    await componentUpdate(component);
    const search = component.find(Search).find('input');
    search.simulate('change', { target: { value: 'provider1' } });
    await componentUpdate(component);

    const addOnsTab = component.find(Tab).at(0);
    expect(addOnsTab.find(Counter).text()).toEqual('1');

    const servicesTab = component.find(Tab).at(1);
    expect(servicesTab.find(Counter).text()).toEqual('1');

    expectKnownConsoleWarnings();
  });

  it('By description', async () => {
    await componentUpdate(component);
    const search = component.find(Search).find('input');
    search.simulate('change', { target: { value: 'description 1' } });
    await componentUpdate(component);

    const addOnsTab = component.find(Tab).at(0);
    expect(addOnsTab.find(Counter).text()).toEqual('2');

    const servicesTab = component.find(Tab).at(1);
    expect(servicesTab.find(Counter).text()).toEqual('1');

    expectKnownConsoleWarnings();
  });
});

function expectKnownConsoleWarnings() {
  expect(consoleWarn.mock.calls).toMatchSnapshot();
}
