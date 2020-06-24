import React from 'react';
import {
  render,
  fireEvent,
  wait,
  waitForDomChange,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import EditApiRule from '../EditApiRule';
import {
  getApiRuleQuery,
  servicesQuery,
  apiRule,
  updateApiRuleMutation,
  mockNamespace,
  oldHostname,
  newHostname,
} from './mocks';
import { idpPresetsQuery } from 'components/ApiRules/ApiRuleForm/test/mocks';

const mockNavigate = jest.fn();

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.local',
}));

jest.mock('@luigi-project/client', () => ({
  getEventData: () => ({
    environmentId: mockNamespace,
  }),
  linkManager: () => ({
    fromClosestContext: () => ({
      navigate: mockNavigate,
    }),
  }),
  getNodeParams: () => ({}),
}));

describe('EditApiRule', () => {
  it('Renders basic component', async () => {
    const { queryByText, queryAllByRole, getAllByLabelText } = render(
      <MockedProvider mocks={[getApiRuleQuery, servicesQuery, idpPresetsQuery]}>
        <EditApiRule apiName={apiRule.name} />
      </MockedProvider>,
    );

    await waitForDomChange();

    expect(queryByText(`Edit ${apiRule.name}`)).toBeInTheDocument();
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
          mocks={[getApiRuleQuery, servicesQuery, updateApiRuleMutation]}
        >
          <EditApiRule apiName={apiRule.name} />
        </MockedProvider>,
      );
      await waitForDomChange();

      queryByPlaceholderText = renderResult.queryByPlaceholderText;
      queryByLabelText = renderResult.queryByLabelText;

      nameInput = queryByPlaceholderText('API Rule name');
      hostnameInput = queryByPlaceholderText('Enter the hostname');
    });

    it('Form inputs are rendered', () => {
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveValue(apiRule.name);
      expect(nameInput).toBeDisabled();

      expect(hostnameInput).toBeInTheDocument();
      expect(hostnameInput).toHaveValue(oldHostname);

      expect(queryByLabelText('submit-form')).toBeDisabled();
    });

    it('Does not allow to update if no hostname', () => {
      fireEvent.change(hostnameInput, { target: { value: '' } });

      expect(hostnameInput).toHaveValue('');
      expect(queryByLabelText('submit-form')).toBeDisabled();
    });

    it('Does not allow to update if invalid host', () => {
      fireEvent.change(hostnameInput, { target: { value: 'host123-' } });

      expect(queryByLabelText('submit-form')).toBeDisabled();
    });

    it('Update button fires updateApiRuleMutation', async () => {
      fireEvent.change(hostnameInput, { target: { value: newHostname } });
      const updateButton = queryByLabelText('submit-form');

      expect(updateButton).not.toBeDisabled();

      updateButton.click();

      await wait(() => {
        expect(updateApiRuleMutation.result).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(`/details/${apiRule.name}`);
      });
    });
  });
});
