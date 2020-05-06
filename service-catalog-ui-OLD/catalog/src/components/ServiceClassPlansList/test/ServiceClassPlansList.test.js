import React from 'react';
import {
  render,
  waitForDomChange,
  queryAllByRole,
  queryByText,
} from '@testing-library/react';
import ServiceClassPlansList, { DocTypesList } from '../ServiceClassPlansList';
import { MockedProvider } from '@apollo/react-testing';
import { serviceClassConstants } from '../../../variables';
import {
  serviceClassPlansQuery,
  serviceClassNoPlansQuery,
  mockEnvironmentId,
} from '../../../testing/queriesMocks';
import { assetGroupWithManyAssets } from '../../../testing/serviceClassesMocks';

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
        <ServiceClassPlansList
          name={serviceClassNoPlansQuery.request.variables.name}
        />
      </MockedProvider>,
    );
    await waitForDomChange(container);

    const table = queryByRole('table');
    expect(table).toBeInTheDocument();
    expect(queryAllByRole(table, 'row')).toHaveLength(1);
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
    const serviceClassPlans =
      serviceClassPlansQuery.result.data.serviceClass.plans;
    const { container, queryByRole } = render(
      <MockedProvider addTypename={false} mocks={[serviceClassPlansQuery]}>
        <ServiceClassPlansList
          name={serviceClassPlansQuery.request.variables.name}
        />
      </MockedProvider>,
    );

    await waitForDomChange(container);
    const table = queryByRole('table');
    expect(table).toBeInTheDocument();
    expect(queryAllByRole(table, 'row')).toHaveLength(serviceClassPlans.length);
    serviceClassPlans.forEach(plan => {
      expect(queryByText(table, plan.displayName)).toBeInTheDocument();
    });
  });

  it('Clicking on element navigates to its details', async () => {
    const serviceClassPlans =
      serviceClassPlansQuery.result.data.serviceClass.plans;
    const { container, getByText } = render(
      <MockedProvider addTypename={false} mocks={[serviceClassPlansQuery]}>
        <ServiceClassPlansList
          name={serviceClassPlansQuery.request.variables.name}
        />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    getByText(serviceClassPlans[1].displayName).click();
    expect(mockNavigate).toHaveBeenCalledWith(
      `details/${serviceClassPlansQuery.result.data.serviceClass.name}/plan/${serviceClassPlans[1].name}`,
    );
  });

  describe('DocTypesList', () => {
    it('Shows no doc types when it should', () => {
      const { queryAllByLabelText } = render(<DocTypesList plan={{}} />);

      expect(queryAllByLabelText('doc-type-badge')).toHaveLength(0);
    });

    it('Shows proper doc types with numbers', () => {
      const { queryByText, queryAllByLabelText } = render(
        <DocTypesList
          plan={{
            name: 'doesntmatter',
            clusterAssetGroup: assetGroupWithManyAssets,
          }}
        />,
      );
      const openapiBadge = queryByText('openapi');
      expect(openapiBadge).toBeInTheDocument();
      expect(openapiBadge.textContent).toBe(
        'openapi' +
          assetGroupWithManyAssets.assets.filter(a => a.type === 'openapi')
            .length,
      );

      const asyncapiBadge = queryByText('asyncapi');
      expect(asyncapiBadge).toBeInTheDocument();
      expect(asyncapiBadge.textContent).toBe(
        'asyncapi' +
          assetGroupWithManyAssets.assets.filter(a => a.type === 'asyncapi')
            .length,
      );

      const odataBadge = queryByText('odata');
      expect(odataBadge).toBeInTheDocument();
      expect(odataBadge.textContent).toBe('odata');

      expect(queryAllByLabelText('doc-type-badge')).toHaveLength(3);
    });
  });
});
