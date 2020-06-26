import React from 'react';
import { render, waitForDomChange, fireEvent } from '@testing-library/react';
import ApiRuleForm, { DEFAULT_GATEWAY } from '../ApiRuleForm';
import { MockedProvider } from '@apollo/react-testing';
import { mockNamespace, apiRule, servicesQuery } from './mocks';
import { supportedMethodsList } from 'components/ApiRules/accessStrategyTypes';

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.cluster.com',
}));

jest.mock('@luigi-project/client', () => ({
  getEventData: () => ({
    environmentId: mockNamespace,
  }),
  getNodeParams: () => ({}),
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
          apiRule={apiRule()}
          mutation={mutation}
          saveButtonText="Save"
          headerTitle="Form"
          breadcrumbItems={[]}
        />
      </MockedProvider>,
    );

    await waitForDomChange({ container });

    const inputs = queryAllByPlaceholderText('Enter the path');
    expect(inputs).toHaveLength(apiRule().rules.length);
    inputs.forEach((input, idx) => {
      expect(input).toHaveValue(apiRule().rules[idx].path);
    });

    supportedMethodsList.forEach(method =>
      verifyMethodCheckboxes(queryAllByLabelText, method),
    );

    const typeSelects = queryAllByLabelText('Access strategy type');
    expect(typeSelects).toHaveLength(apiRule().rules.length);
    typeSelects.forEach((typeSelect, idx) => {
      expect(typeSelect).toHaveValue(
        apiRule().rules[idx].accessStrategies[0].name,
      );
    });
  });

  it('allows to add new access strategy', async () => {
    const mutation = jest.fn();
    const { queryAllByPlaceholderText, getByText, container } = render(
      <MockedProvider mocks={[servicesQuery]}>
        <ApiRuleForm
          apiRule={apiRule()}
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
    expect(paths).toHaveLength(apiRule().rules.length + 1);

    fireEvent.change(paths[apiRule().rules.length], {
      target: { value: '/path' },
    });

    getByText('Save').click();
    expect(mutation).toHaveBeenCalledWith({
      variables: {
        name: apiRule().name,
        namespace: mockNamespace,
        params: {
          gateway: DEFAULT_GATEWAY,
          service: apiRule().service,
          rules: [
            ...apiRule().rules,
            {
              methods: [],
              path: '/path',
              accessStrategies: [{ name: 'noop', config: {} }],
            },
          ],
        },
      },
    });
  });

  it('allows to remove access strategy', async () => {
    const mutation = jest.fn();
    const { getAllByLabelText, getByText, container } = render(
      <MockedProvider mocks={[servicesQuery]}>
        <ApiRuleForm
          apiRule={apiRule()}
          mutation={mutation}
          saveButtonText="Save"
          headerTitle="Form"
          breadcrumbItems={[]}
        />
      </MockedProvider>,
    );

    await waitForDomChange({ container });

    getAllByLabelText('remove-access-strategy')[0].click();

    await waitForDomChange({ container });

    getByText('Save').click();
    expect(mutation).toHaveBeenCalledWith({
      variables: {
        name: apiRule().name,
        namespace: mockNamespace,
        params: {
          gateway: DEFAULT_GATEWAY,
          service: apiRule().service,
          rules: [apiRule().rules[1]],
        },
      },
    });
  });

  it('does not modify other strategies after removing one', async () => {
    const mutation = jest.fn();
    const rule = apiRule();
    const { getAllByLabelText, container } = render(
      <MockedProvider mocks={[servicesQuery]}>
        <ApiRuleForm
          apiRule={rule}
          mutation={mutation}
          saveButtonText="Save"
          headerTitle="Form"
          breadcrumbItems={[]}
        />
      </MockedProvider>,
    );
    await waitForDomChange({ container });

    getAllByLabelText('remove-access-strategy')[0].click();

    await waitForDomChange({ container });

    const strategySelects = getAllByLabelText('Access strategy type');
    const nonRemovedRule = rule.rules[1].accessStrategies[0];
    expect(strategySelects[0].value).toBe(nonRemovedRule.name);
  });

  it('allows to modify exisitng access strategy', async () => {
    const mutation = jest.fn();
    const { getAllByLabelText, getByText, container } = render(
      <MockedProvider mocks={[servicesQuery]}>
        <ApiRuleForm
          apiRule={apiRule()}
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
        name: apiRule().name,
        namespace: mockNamespace,
        params: {
          gateway: DEFAULT_GATEWAY,
          service: apiRule().service,
          rules: [
            {
              ...apiRule().rules[0],
              path: '/path',
            },
            apiRule().rules[1],
          ],
        },
      },
    });
  });
});

function verifyMethodCheckboxes(queryAllByLabelText, method) {
  const checkboxes = queryAllByLabelText(method);
  expect(checkboxes).toHaveLength(apiRule().rules.length);
  checkboxes.forEach((checkboxe, idx) => {
    if (apiRule().rules[idx].methods.indexOf(method) !== -1)
      expect(checkboxe).toBeChecked();
    else expect(checkboxe).not.toBeChecked();
  });
}
