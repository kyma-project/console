import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import {
  render,
  wait,
  fireEvent,
  waitForDomChange,
} from '@testing-library/react';
import {
  serviceClassAPIruleQuery,
  serviceClassWithPlans,
} from 'testing/catalog/queriesMocks';
import ServiceClassDetails, { PlanSelector } from '../ServiceClassDetails';
import { Spinner } from 'react-shared';
import { componentUpdate, mockTestNamespace } from 'testing';
import ServiceClassDetailsHeader from '../ServiceClassDetailsHeader/ServiceClassDetailsHeader.component';
import { mockPlan } from 'testing/catalog/serviceClassesMocks';

const mockNavigate = jest.fn();
const mockAddBackdrop = jest.fn();
const mockRemoveBackdrop = jest.fn();
const mockShowAlert = jest.fn();

jest.mock('@kyma-project/generic-documentation', () => {
  return <div>GENERIC DOCUMENTATION COMPONENT</div>;
});

jest.mock('@kyma-project/luigi-client', () => ({
  getContext: () => ({
    namespaceId: mockTestNamespace,
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
      <MockedProvider mocks={[serviceClassWithPlans]}>
        <ServiceClassDetails
          name={serviceClassWithPlans.result.data.clusterServiceClass.name}
        />
      </MockedProvider>,
    );

    expect(component.find(Spinner).exists()).toBe(true);

    await componentUpdate(component);
    expect(component.find(Spinner).exists()).toBe(false);
    await componentUpdate(component); // get rid of 'act' warning that pops up randmly
  });

  it('Displays service class details ', async () => {
    const component = mount(
      <MockedProvider mocks={[serviceClassWithPlans]}>
        <ServiceClassDetails
          name={serviceClassWithPlans.result.data.clusterServiceClass.name}
        />
      </MockedProvider>,
    );
    await componentUpdate(component);
    await componentUpdate(component);

    expect(component.find(ServiceClassDetailsHeader).exists()).toBe(true);
    await componentUpdate(component); // get rid of 'act' warning that pops up randmly
  });

  describe('API packages', () => {
    it('Shows error when the provided plan name is wrong', async () => {
      const query = serviceClassAPIruleQuery([]);
      render(
        <MockedProvider mocks={[query]}>
          <ServiceClassDetails
            plan="non-existing"
            name={query.result.data.serviceClass.name}
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
      const query = serviceClassAPIruleQuery([mockPlan(1), mockPlan(2)]);
      const { queryByLabelText, queryByText } = render(
        <MockedProvider mocks={[query]}>
          <ServiceClassDetails
            plan={query.result.data.serviceClass.plans[0].name}
            name={query.result.data.serviceClass.name}
          />
        </MockedProvider>,
      );

      await waitForDomChange();

      expect(queryByLabelText('docs-per-plan-icon')).toBeInTheDocument();
      expect(
        queryByText(
          `${query.result.data.serviceClass.displayName} - Plans list`,
        ),
      ).toBeInTheDocument();
    });

    it("Shows no breadcrumb when there's only one plan", async () => {
      const query = serviceClassAPIruleQuery([mockPlan(1)]);
      const { queryByLabelText, queryByText } = render(
        <MockedProvider mocks={[query]}>
          <ServiceClassDetails
            plan={query.result.data.serviceClass.plans[0].name}
            name={query.result.data.serviceClass.name}
          />
        </MockedProvider>,
      );

      await wait(() => {
        expect(queryByLabelText('docs-per-plan-icon')).toBeInTheDocument();
        expect(queryByText(`Plans list`)).not.toBeInTheDocument();
      });
    });

    it("Doesn't show API package icon or breadcrumb when label isn't present", async () => {
      const { queryByLabelText, queryByText } = render(
        <MockedProvider mocks={[serviceClassWithPlans]}>
          <ServiceClassDetails
            name={serviceClassWithPlans.result.data.clusterServiceClass.name}
          />
        </MockedProvider>,
      );

      await wait(() => {
        expect(queryByLabelText('docs-per-plan-icon')).not.toBeInTheDocument();
        expect(queryByText(`Plans list`)).not.toBeInTheDocument();
      });
    });
    describe('PlanSelector', () => {
      it('Renders no plans', () => {
        const { queryByRole } = render(
          <PlanSelector allPlans={[]} onPlanChange={jest.fn()} />,
        );
        expect(queryByRole('option')).not.toBeInTheDocument();
      });

      it('Renders plan list', () => {
        const { queryAllByRole } = render(
          <PlanSelector
            allPlans={[{ name: 'plan1' }, { name: 'plan2' }]}
            onPlanChange={jest.fn()}
          />,
        );
        expect(queryAllByRole('option')).toHaveLength(2);
      });

      it('Renders plan list', () => {
        const { queryAllByRole } = render(
          <PlanSelector
            allPlans={[{ name: 'plan1' }, { name: 'plan2' }]}
            onPlanChange={jest.fn()}
          />,
        );
        expect(queryAllByRole('option')).toHaveLength(2);
      });

      it('Fires a proper callback', () => {
        const mockOnPlanChange = jest.fn();
        const { getByLabelText } = render(
          <PlanSelector
            allPlans={[{ name: 'plan1' }, { name: 'plan2' }]}
            currentlySelected={{ name: 'plan2' }}
            onPlanChange={mockOnPlanChange}
          />,
        );
        const select = getByLabelText('plan-selector');
        expect(mockOnPlanChange).not.toHaveBeenCalled();

        fireEvent.change(select, { target: { value: 'plan2' } });

        expect(mockOnPlanChange).toHaveBeenCalled();
      });
    });
  });
});
