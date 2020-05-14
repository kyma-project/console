import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { allServiceClassesQuery } from 'testing/catalog/queriesMocks';
import { Spinner, Tab } from '@kyma-project/react-components';
import ServiceClassList from '../ServiceClassList';
import { componentUpdate, mockTestNamespace } from 'testing';
import { FormInput, Identifier } from 'fundamental-react';

const mockNavigate = jest.fn();

const servicesTabIndex = 0;
const addonsTabIndex = 1;

jest.mock('@kyma-project/luigi-client', () => ({
  getContext: () => ({
    namespaceId: mockTestNamespace,
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
  const component = mount(
    <MockedProvider mocks={[allServiceClassesQuery]}>
      <ServiceClassList />
    </MockedProvider>,
  );
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

  it('Add-Ons tab has proper counter', async () => {
    await componentUpdate(component);

    const addOnsTab = component.find(Tab).at(addonsTabIndex);
    expect(addOnsTab.find(Identifier).text()).toEqual(
      allServiceClassesQuery.result.data.serviceClasses.length.toString(),
    );

    expectKnownConsoleWarnings();
  });

  it('Services tab has proper counter', async () => {
    await componentUpdate(component);
    const servicesTab = component.find(Tab).at(servicesTabIndex);
    expect(servicesTab.find(Identifier).text()).toEqual(
      allServiceClassesQuery.result.data.clusterServiceClasses.length.toString(),
    );

    expectKnownConsoleWarnings();
  });

  it('Displays classes with their corresponding names on the add-ons/services list', async () => {
    await componentUpdate(component);

    const addonsCards = component.find('.fd-tile__title');

    expect(addonsCards.exists()).toBe(true);
    expect(addonsCards).toHaveLength(
      allServiceClassesQuery.result.data.serviceClasses.length,
    );
    expect(addonsCards.at(0).text()).toEqual(
      allServiceClassesQuery.result.data.serviceClasses[0].displayName,
    );
    expect(addonsCards.at(1).text()).toEqual(
      allServiceClassesQuery.result.data.serviceClasses[1].displayName,
    );

    component
      .find(Tab)
      .at(servicesTabIndex)
      .find('div')
      .first()
      .simulate('click');

    await componentUpdate(component);

    const servicesCards = component.find('.fd-tile__title');

    expect(servicesCards.exists()).toBe(true);
    expect(servicesCards).toHaveLength(
      allServiceClassesQuery.result.data.clusterServiceClasses.length,
    );

    expect(servicesCards.at(0).text()).toEqual(
      allServiceClassesQuery.result.data.clusterServiceClasses[0].displayName,
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
      `details/${allServiceClassesQuery.result.data.serviceClasses[0].name}`,
    );

    expectKnownConsoleWarnings();
  });
});

describe('Search classes by name', () => {
  const component = mount(
    <MockedProvider mocks={[allServiceClassesQuery]}>
      <ServiceClassList />
    </MockedProvider>,
  );

  it('Set search text gives no error', async () => {
    await componentUpdate(component);
    const search = component.find(FormInput).find('input');
    expect(search.exists()).toBe(true);
    search.simulate('change', { target: { value: 'displayName1' } });

    expectKnownConsoleWarnings();
  });
});

describe('Search classes by other attributes', () => {
  const component = mount(
    <MockedProvider mocks={[allServiceClassesQuery]}>
      <ServiceClassList />
    </MockedProvider>,
  );

  it('By provider', async () => {
    const searchedClass = allServiceClassesQuery.result.data.serviceClasses[0];
    await componentUpdate(component);
    const search = component.find(FormInput).find('input');
    search.simulate('change', {
      target: { value: searchedClass.providerDisplayName },
    });
    await componentUpdate(component);

    const addOnsTab = component.find(Tab).at(addonsTabIndex);
    expect(addOnsTab.find(Identifier).text()).toEqual('1');

    expectKnownConsoleWarnings();
  });

  it('By description', async () => {
    const searchedClass = allServiceClassesQuery.result.data.serviceClasses[0];

    await componentUpdate(component);
    const search = component.find(FormInput).find('input');
    search.simulate('change', { target: { value: searchedClass.description } });
    await componentUpdate(component);

    const addOnsTab = component.find(Tab).at(addonsTabIndex);
    expect(addOnsTab.find(Identifier).text()).toEqual('1');

    expectKnownConsoleWarnings();
  });
});

function expectKnownConsoleWarnings() {
  expect(consoleWarn.mock.calls).toMatchSnapshot();
}
