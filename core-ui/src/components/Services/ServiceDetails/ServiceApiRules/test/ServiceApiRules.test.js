import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ServiceApiRules from '../ServiceApiRules';
import { namespaceId, service, apiRulesQuery, apiRules } from './mocks';
import { MockedProvider } from '@apollo/react-testing';

const mockNavigate = jest.fn();
jest.mock('@luigi-project/client', () => ({
  linkManager: () => ({
    fromContext: () => ({
      withParams: () => ({ navigate: mockNavigate }),
      navigate: mockNavigate,
    }),
  }),
  uxManager: () => ({ showConfirmationModal: () => Promise.resolve(true) }),
}));

describe('ServiceApiRules', () => {
  it('Renders with minimal props', async () => {
    const { queryByText, queryAllByRole } = render(
      <MockedProvider mocks={[apiRulesQuery]} addTypename={false}>
        <ServiceApiRules namespaceId={namespaceId} service={service} />
      </MockedProvider>,
    );

    await wait(() => {
      expect(queryAllByRole('row').toHaveLength(2));
      expect(queryByText(apiRules[0].name)).toBeInTheDocument();
      expect(queryByText(apiRules[1].name)).toBeInTheDocument();
    });
  });

  it('Navigates to API Rule creator after clicking on "Expose API"', async () => {
    const { findByText } = render(
      <MockedProvider mocks={[apiRulesQuery]} addTypename={false}>
        <ServiceApiRules namespaceId={namespaceId} service={service} />
      </MockedProvider>,
    );

    fireEvent.click(await findByText(/Expose API/));
    expect(mockNavigate).toHaveBeenCalledWith('cmf-apirules/create');
  });

  it('Navigates to API Rule details"', async () => {
    const { findByText } = render(
      <MockedProvider mocks={[apiRulesQuery]} addTypename={false}>
        <ServiceApiRules namespaceId={namespaceId} service={service} />
      </MockedProvider>,
    );

    const name = apiRules[0].name;
    fireEvent.click(await findByText(name));
    expect(mockNavigate).toHaveBeenCalledWith(`cmf-apirules/details/${name}`);
  });

  it('Navigates to API Rule details - edit mode', async () => {
    const { findAllByLabelText } = render(
      <MockedProvider mocks={[apiRulesQuery]} addTypename={false}>
        <ServiceApiRules namespaceId={namespaceId} service={service} />
      </MockedProvider>,
    );

    fireEvent.click((await findAllByLabelText('Edit'))[0]);
    expect(mockNavigate).toHaveBeenCalledWith(
      `cmf-apirules/edit/${apiRules[0].name}`,
    );
  });
});
