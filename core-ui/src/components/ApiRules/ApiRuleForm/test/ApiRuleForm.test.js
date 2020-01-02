import React from 'react';
import { render, waitForDomChange, fireEvent } from '@testing-library/react';
import ApiRuleForm, { DEFAULT_GATEWAY } from '../ApiRuleForm';
import { MockedProvider } from '@apollo/react-testing';
import { mockNamespace, apiRule, servicesQuery } from './mocks';

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.cluster.com',
}));

jest.mock('@kyma-project/luigi-client', () => ({
  getEventData: () => ({
    environmentId: mockNamespace,
  }),
}));

describe('ApiRuleForm', () => {
  const mutation = jest.fn();

  beforeEach(() => {
    mutation.mockReset();
  });

  it('renders exisitng access strategies', async () => {
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

  it('allows to add new access strategy', async () => {
    const mutation = jest.fn();
    const { queryAllByPlaceholderText, getByText, container } = render(
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

    getByText('Add access strategy').click();

    const paths = queryAllByPlaceholderText('Enter the path');
    expect(paths).toHaveLength(apiRule.rules.length + 1);

    fireEvent.change(paths[apiRule.rules.length], {
      target: { value: '/path' },
    });

    getByText('Save').click();
    expect(mutation).toHaveBeenCalledWith({
      variables: {
        name: apiRule.name,
        namespace: mockNamespace,
        params: {
          gateway: DEFAULT_GATEWAY,
          host: apiRule.service.host,
          serviceName: apiRule.service.name,
          servicePort: `${apiRule.service.port}`,
          rules: [
            ...apiRule.rules,
            {
              methods: [],
              mutators: [],
              path: '/path',
              accessStrategies: [{ name: 'allow', config: {} }],
            },
          ],
        },
      },
    });
  });

  it('allows to modify exisitng access strategy', async () => {
    const mutation = jest.fn();
    const { getAllByLabelText, getByText, container, debug } = render(
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

    const paths = getAllByLabelText('Access strategy path');

    fireEvent.change(paths[0], {
      target: { value: '/path' },
    });

    getByText('Save').click();
    expect(mutation).toHaveBeenCalledWith({
      variables: {
        name: apiRule.name,
        namespace: mockNamespace,
        params: {
          gateway: DEFAULT_GATEWAY,
          host: apiRule.service.host,
          serviceName: apiRule.service.name,
          servicePort: `${apiRule.service.port}`,
          rules: [
            {
              ...apiRule.rules[0],
              path: '/path',
            },
            apiRule.rules[1],
          ],
        },
      },
    });
  });
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
