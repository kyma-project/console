import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { render, wait } from '@testing-library/react';
import {
  serviceClassQuery,
  serviceClassAPIruleQuery,
  mockEnvironmentId,
} from '../../../testing/queriesMocks';
import {
  clusterServiceClass1Name,
  serviceClassWithAPIrule,
} from '../../../testing/serviceClassesMocks';
import ServiceClassDetails from '../ServiceClassDetails';
import { Spinner } from '../../../react-shared';
import { componentUpdate } from '../../../testing';
import ServiceClassDetailsHeader from '../ServiceClassDetailsHeader/ServiceClassDetailsHeader.component';

const mockNavigate = jest.fn();
const mockAddBackdrop = jest.fn();
const mockRemoveBackdrop = jest.fn();
const mockShowAlert = jest.fn();

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
    showAlert: mockShowAlert,
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
    await componentUpdate(component); // get rid of 'act' warning that pops up randmly
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
    await componentUpdate(component); // get rid of 'act' warning that pops up randmly
  });

  describe('API packages', () => {
    it('Shows error when the provided plan name is wrong', async () => {
      render(
        <MockedProvider mocks={[serviceClassAPIruleQuery]}>
          <ServiceClassDetails
            plan="non-existing"
            name={serviceClassWithAPIrule.name}
          />
        </MockedProvider>,
      );

      await wait(() => {
        expect(mockShowAlert).toHaveBeenCalledWith({
          type: 'error',
          text:
            'The provided plan name is wrong. Please make sure you selected the right one.',
        });
        mockShowAlert.mockReset();
      });
    });

    it('Shows API package icon and breadcrumb when the label is present', async () => {
      const { queryByLabelText, queryByText, debug } = render(
        <MockedProvider mocks={[serviceClassAPIruleQuery]}>
          <ServiceClassDetails
            plan={serviceClassWithAPIrule.plans[0].name}
            name={serviceClassWithAPIrule.name}
          />
        </MockedProvider>,
      );

      await wait(() => {
        expect(queryByLabelText('docs-per-plan-icon')).toBeInTheDocument();
        expect(
          queryByText(`${serviceClassWithAPIrule.displayName} - Plans list`),
        ).toBeInTheDocument();
      });
    });

    it("Doesn't show API package icon or breadcrumb when label isn't present", async () => {
      const { queryByLabelText, queryByText } = render(
        <MockedProvider mocks={[serviceClassQuery]}>
          <ServiceClassDetails name={serviceClassWithAPIrule.name} />
        </MockedProvider>,
      );

      await wait(() => {
        expect(queryByLabelText('docs-per-plan-icon')).not.toBeInTheDocument();
        expect(
          queryByText(`${serviceClassWithAPIrule.displayName} - Plans list`),
        ).not.toBeInTheDocument();
      });
    });
  });
});
