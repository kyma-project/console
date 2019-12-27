import React from 'react';
import CreateApiRule from '../CreateApiRule';
import { render, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import {
  servicesQuery,
  createApiRuleMutation,
} from '../../../../testing/queriesMocks';

const mockNamespace = 'test';

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.local',
}));

jest.mock('@kyma-project/luigi-client', () => ({
  getEventData: () => ({
    environmentId: mockNamespace,
  }),
}));

describe('CreateApiRule', () => {
  it('Renders basic component', async () => {
    const { queryByText, queryAllByRole, getAllByLabelText } = render(
      <MockedProvider mocks={[servicesQuery]}>
        <CreateApiRule />
      </MockedProvider>,
    );

    await wait();

    expect(queryByText('Create API Rule')).toBeInTheDocument();
    expect(queryByText('General settings')).toBeInTheDocument();
    expect(queryAllByRole('input')).toHaveLength(2);
    expect(queryAllByRole('select')).toHaveLength(1);
    expect(getAllByLabelText('option')).toHaveLength(3);

    expect(queryByText('Access strategies')).toBeInTheDocument();
    expect(queryAllByRole('row')).toHaveLength(1);
  });

  describe('Form validation', () => {
    let queryByPlaceholderText, queryByLabelText;
    let nameInput, hostnameInput;

    beforeEach(async () => {
      const renderResult = render(
        <MockedProvider
          addTypename={false}
          mocks={[servicesQuery, createApiRuleMutation]}
        >
          <CreateApiRule />
        </MockedProvider>,
      );
      await wait();

      queryByPlaceholderText = renderResult.queryByPlaceholderText;
      queryByLabelText = renderResult.queryByLabelText;

      nameInput = queryByPlaceholderText('API Rule name');
      hostnameInput = queryByPlaceholderText('Enter the hostname');
    });

    it('Form inputs are rendered', () => {
      expect(nameInput).toBeInTheDocument();
      expect(hostnameInput).toBeInTheDocument();
    });

    it('Does not allow to create if no name or hostname', () => {
      expect(nameInput.value).toBe('');
      expect(hostnameInput.value).toBe('');
      expect(queryByLabelText('submit-form')).toBeDisabled();
    });

    it('Does not allow to create if invalid name', () => {
      fireEvent.change(nameInput, { target: { value: 'test-' } });
      fireEvent.change(hostnameInput, { target: { value: 'host-1.2.3' } });

      expect(queryByLabelText('submit-form')).toBeDisabled();
    });

    it('Does not allow to create if invalid host', () => {
      fireEvent.change(nameInput, { target: { value: 'test-123' } });
      fireEvent.change(hostnameInput, { target: { value: 'host123-' } });

      expect(queryByLabelText('submit-form')).toBeDisabled();
    });

    it('Create button fires createApiRuleMutation', async () => {
      fireEvent.change(nameInput, { target: { value: 'test-123' } });
      fireEvent.change(hostnameInput, { target: { value: 'host-1.2.3' } });
      const createButton = queryByLabelText('submit-form');

      expect(createButton).not.toBeDisabled();

      createButton.click();
      await wait();

      expect(createApiRuleMutation.result).toHaveBeenCalled();
    });
  });
});
