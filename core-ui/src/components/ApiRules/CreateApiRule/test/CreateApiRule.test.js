import React from 'react';
import CreateApiRule from '../CreateApiRule';
import {
  render,
  fireEvent,
  wait,
  waitForDomChange,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import {
  mockNamespace,
  servicesQuery,
  createApiRuleMutation,
  hostname,
  apiRuleName,
} from './mocks';

const mockNavigate = jest.fn();

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.local',
}));

describe('CreateApiRule', () => {
  it('Renders basic component', async () => {
    const { queryByText, queryAllByRole, getAllByLabelText } = render(
      <MockedProvider mocks={[servicesQuery]}>
        <CreateApiRule />
      </MockedProvider>,
    );

    await waitForDomChange();

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
    let nameInput, hostnameInput, pathInput;

    beforeEach(async () => {
      const renderResult = render(
        <MockedProvider
          addTypename={false}
          mocks={[servicesQuery, createApiRuleMutation]}
        >
          <CreateApiRule />
        </MockedProvider>,
      );
      await waitForDomChange();

      queryByPlaceholderText = renderResult.queryByPlaceholderText;
      queryByLabelText = renderResult.queryByLabelText;

      nameInput = queryByPlaceholderText('API Rule name');
      hostnameInput = queryByPlaceholderText('Enter the hostname');
      pathInput = queryByPlaceholderText('Enter the path');
    });

    it('Form inputs are rendered', () => {
      expect(nameInput).toBeInTheDocument();
      expect(hostnameInput).toBeInTheDocument();
      expect(pathInput).toBeInTheDocument();
    });

    it('Does not allow to create if no name or hostname', () => {
      expect(nameInput).toHaveValue('');
      expect(hostnameInput).toHaveValue('');
      expect(queryByLabelText('submit-form')).toBeDisabled();
    });

    it('Does not allow to create if invalid name', () => {
      fireEvent.change(nameInput, { target: { value: 'test-' } });
      fireEvent.change(hostnameInput, { target: { value: hostname } });

      expect(queryByLabelText('submit-form')).toBeDisabled();
    });

    it('Does not allow to create if invalid host', () => {
      fireEvent.change(nameInput, { target: { value: apiRuleName } });
      fireEvent.change(hostnameInput, { target: { value: 'host123-' } });

      expect(queryByLabelText('submit-form')).toBeDisabled();
    });

    it('Create button fires createApiRuleMutation', async () => {
      fireEvent.change(nameInput, { target: { value: apiRuleName } });
      fireEvent.change(hostnameInput, { target: { value: hostname } });
      const createButton = queryByLabelText('submit-form');

      expect(createButton).not.toBeDisabled();

      createButton.click();

      await wait(() => {
        expect(createApiRuleMutation.result).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(`/details/${apiRuleName}`);
      });
    });
  });
});
