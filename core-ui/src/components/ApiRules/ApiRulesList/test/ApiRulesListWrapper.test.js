import React from 'react';
import {
  render,
  waitForDomChange,
  queryAllByRole,
  queryByText,
  getByLabelText,
} from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import {
  API_RULE_EVENT_SUBSCRIPTION_MOCK,
  GET_API_RULES_DATA_MOCK,
  apiRuleMock,
} from 'components/ApiRules/gql/mocks/useApiRulesQuery';

import ApiRulesListWrapper from '../ApiRulesListWrapper';
import ApiRulesList from '../ApiRulesList';

import ApiRuleStatus from 'components/ApiRules/ApiRuleStatus/ApiRuleStatus';
import {
  GoToApiRuleDetails,
  CopiableApiRuleHost,
  ApiRuleServiceInfo,
} from '../components';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { PANEL } from '../../constants';

const mockNavigate = jest.fn();
const mockShowConfirmationModal = jest.fn(() => Promise.resolve());

jest.mock('@luigi-project/client', () => ({
  getContext: () => ({
    namespaceId: 'namespace',
  }),
  linkManager: () => ({
    fromContext: () => ({
      navigate: mockNavigate,
    }),
  }),
  uxManager: () => ({
    showConfirmationModal: mockShowConfirmationModal,
  }),
}));

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.cluster.com',
}));

const rowRenderer = apiRule => [
  <GoToApiRuleDetails apiRule={apiRule} />,
  <CopiableApiRuleHost apiRule={apiRule} />,
  <ApiRuleServiceInfo apiRule={apiRule} />,
  <ApiRuleStatus apiRule={apiRule} />,
];

describe('ApiRulesListWrapper + ApiRulesList', () => {
  const namespace = 'namespace';
  const variables = {
    namespace,
  };
  const queryMock = GET_API_RULES_DATA_MOCK(variables);
  const subscriptionMock = API_RULE_EVENT_SUBSCRIPTION_MOCK(variables);

  it('query hook should works', async () => {
    const { queryByText, container } = render(
      <MockedProvider addTypename={false} mocks={[subscriptionMock, queryMock]}>
        <ApiRulesListWrapper namespace={namespace} />
      </MockedProvider>,
    );

    await waitForDomChange(container);
  });

  it('should render table', async () => {
    const { queryByRole, container } = render(
      <MockedProvider addTypename={false} mocks={[subscriptionMock, queryMock]}>
        <ApiRulesListWrapper namespace={namespace} rowRenderer={rowRenderer} />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    const table = queryByRole('table');
    expect(table).toBeInTheDocument();
    expect(queryAllByRole(table, 'row')).toHaveLength(2); // entry + header
    expect(queryByText(table, apiRuleMock.name)).toBeInTheDocument();
    expect(queryByText(table, 'OK')).toBeInTheDocument();
  });

  it('should render table with default props', async () => {
    const { queryByRole, queryByText } = render(
      <ApiRulesList apiRules={[apiRuleMock]} />,
    );

    const table = queryByRole('table');
    expect(table).toBeInTheDocument();
    expect(queryAllByRole(table, 'row')).toHaveLength(2); // header + apiRule
    expect(queryByText(PANEL.LIST.TITLE)).toBeInTheDocument();
    expect(queryByText(PANEL.CREATE_BUTTON.TEXT)).toBeInTheDocument();
  });

  it('should render empty table', async () => {
    const { queryByRole } = render(<ApiRulesList apiRules={[]} />);

    const table = queryByRole('table');
    expect(table).toBeInTheDocument();
    expect(queryAllByRole(table, 'row')).toHaveLength(2); // header + not found message

    const notFoundMessage = formatMessage(
      PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND,
      {
        resourceType: 'Namespace',
      },
    );
    expect(queryByText(table, notFoundMessage)).toBeInTheDocument();
  });

  it('Clicking on element navigates to its details', async () => {
    const { getByText } = render(
      <ApiRulesList apiRules={[apiRuleMock]} rowRenderer={rowRenderer} />,
    );

    getByText(apiRuleMock.name).click();
    expect(mockNavigate).toHaveBeenCalledWith(
      `cmf-apirules/details/${apiRuleMock.name}`,
    );
  });

  it('Clicking on "Create" navigate to creation page', async () => {
    const { getByText } = render(
      <ApiRulesList apiRules={[apiRuleMock]} rowRenderer={rowRenderer} />,
    );

    getByText(PANEL.CREATE_BUTTON.TEXT).click();
    expect(mockNavigate).toHaveBeenCalledWith('cmf-apirules/create');
  });

  it('Clicking on "Create" navigate to creation page', async () => {
    const { getByText } = render(
      <ApiRulesList apiRules={[apiRuleMock]} rowRenderer={rowRenderer} />,
    );

    getByText(PANEL.CREATE_BUTTON.TEXT).click();
    expect(mockNavigate).toHaveBeenCalledWith('cmf-apirules/create');
  });

  it('Clicking on "Edit" navigate to edit page', async () => {
    const { queryAllByLabelText } = render(
      <ApiRulesList apiRules={[apiRuleMock]} rowRenderer={rowRenderer} />,
    );

    const editButtons = queryAllByLabelText('Edit');
    expect(editButtons).toHaveLength(1);
    editButtons[0].click();
    expect(mockNavigate).toHaveBeenCalledWith(
      `cmf-apirules/edit/${apiRuleMock.name}`,
    );
  });
});
