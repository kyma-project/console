import React from 'react';
import {
  render,
  waitForDomChange,
  queryAllByRole,
  queryByText,
} from '@testing-library/react';
import ServiceClassPlansList from '../ServiceClassPlansList';
import { MockedProvider } from '@apollo/react-testing';
import { serviceClassConstants } from '../../../variables';
import {
  serviceClassPlansQuery,
  serviceClassNoPlansQuery,
  mockEnvironmentId,
} from '../../../testing/queriesMocks';
import {
  clusterServiceClass1Name,
  serviceClassWithPlans,
} from '../../../testing/serviceClassesMocks';

const mockName = clusterServiceClass1Name;
const mockNavigate = jest.fn();
const mockShowConfirmationModal = jest.fn(() => Promise.resolve());

jest.mock('@kyma-project/luigi-client', () => ({
  getEventData: () => ({
    environmentId: mockEnvironmentId,
  }),
  linkManager: () => ({
    fromClosestContext: () => ({
      navigate: mockNavigate,
    }),
  }),
  uxManager: () => ({
    showConfirmationModal: mockShowConfirmationModal,
  }),
}));

describe('ServiceClassPlans', () => {
  afterEach(() => {
    mockNavigate.mockReset();
  });

  it('Renders empty list', async () => {
    const { container, queryByRole } = render(
      <MockedProvider addTypename={false} mocks={[serviceClassNoPlansQuery]}>
        <ServiceClassPlansList name={mockName} />
      </MockedProvider>,
    );
    await waitForDomChange(container);

    const table = queryByRole('table');
    expect(table).toBeInTheDocument();
    expect(queryAllByRole(table, 'row')).toHaveLength(2);
    expect(queryByText(table, 'No entries found')).toBeInTheDocument();
  });

  it('Shows loading status', async () => {
    const { container, queryByRole, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={[serviceClassNoPlansQuery]}>
        <ServiceClassPlansList />
      </MockedProvider>,
    );

    expect(queryByRole('table')).not.toBeInTheDocument();
    expect(queryByLabelText('Loading')).toBeInTheDocument();

    await waitForDomChange(container);
  });

  it('Shows error status', async () => {
    const { container, queryByRole, queryByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={[]}>
        <ServiceClassPlansList />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    expect(queryByRole('table')).not.toBeInTheDocument();
    expect(queryByLabelText('Loading')).not.toBeInTheDocument();
    expect(
      queryByText(serviceClassConstants.errorServiceClassPlansList),
    ).toBeInTheDocument();
  });

  it('Renders some elements', async () => {
    const serviceClassPlans = serviceClassWithPlans.plans;
    const { container, queryByRole } = render(
      <MockedProvider addTypename={false} mocks={[serviceClassPlansQuery]}>
        <ServiceClassPlansList name={mockName} />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    const table = queryByRole('table');
    expect(table).toBeInTheDocument();
    expect(queryAllByRole(table, 'row')).toHaveLength(3);
    serviceClassPlans.forEach(plan => {
      expect(queryByText(table, plan.displayName)).toBeInTheDocument();
    });
  });

  it('Clicking on element navigates to its details', async () => {
    const serviceClassPlans = serviceClassWithPlans.plans;
    const { container, getByText } = render(
      <MockedProvider addTypename={false} mocks={[serviceClassPlansQuery]}>
        <ServiceClassPlansList name={mockName} />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    getByText(serviceClassPlans[1].displayName).click();
    expect(mockNavigate).toHaveBeenCalledWith(
      `details/${serviceClassPlans[1].relatedServiceClassName}/plan/${serviceClassPlans[1].name}`,
    );
  });
});
