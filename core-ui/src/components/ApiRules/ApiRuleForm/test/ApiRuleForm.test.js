import React from 'react';
import { render, waitForDomChange } from '@testing-library/react';
import ApiRuleForm from '../ApiRuleForm';
import { MockedProvider } from '@apollo/react-testing';
import { mockNamespace, apiRule, servicesQuery } from './mocks';

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.local',
}));

jest.mock('@kyma-project/luigi-client', () => ({
  getEventData: () => ({
    environmentId: mockNamespace,
  }),
}));

describe('ApiRuleForm', () => {
  it('renders exisitng access strategies', async () => {
    const mutation = jest.fn();
    const {
      queryAllByPlaceholderText,
      queryAllByLabelText,
      container,
    } = render(
      <MockedProvider mocks={[servicesQuery]}>
        <ApiRuleForm
          apiRule={apiRule}
          mutation={mutation}
          saveButtonText="Save"
          headerTitle="Form"
          breadcrumbItems={[]}
        />
      </MockedProvider>,
    );

    await waitForDomChange({ container });

    const inputs = queryAllByPlaceholderText('Enter the path');
    expect(inputs).toHaveLength(apiRule.rules.length);
    inputs.forEach((input, idx) => {
      expect(input).toHaveValue(apiRule.rules[idx].path);
    });

    verifyMethodCheckboxes(queryAllByLabelText, 'GET');
    verifyMethodCheckboxes(queryAllByLabelText, 'PUT');
    verifyMethodCheckboxes(queryAllByLabelText, 'POST');
    verifyMethodCheckboxes(queryAllByLabelText, 'DELETE');

    const typeSelects = queryAllByLabelText('Access strategy type');
    expect(typeSelects).toHaveLength(apiRule.rules.length);
    typeSelects.forEach((typeSelect, idx) => {
      expect(typeSelect).toHaveValue(
        apiRule.rules[idx].accessStrategies[0].name,
      );
    });
  });

  test.todo('allows to add new allow access strategy');
  test.todo('allows to add new oauth2 access strategy');
  test.todo('allows to modify exisitng access strategy');
});

function verifyMethodCheckboxes(queryAllByLabelText, method) {
  const checkboxes = queryAllByLabelText(method);
  expect(checkboxes).toHaveLength(apiRule.rules.length);
  checkboxes.forEach((checkboxe, idx) => {
    if (apiRule.rules[idx].methods.indexOf(method) !== -1)
      expect(checkboxe).toBeChecked();
    else expect(checkboxe).not.toBeChecked();
  });
}
