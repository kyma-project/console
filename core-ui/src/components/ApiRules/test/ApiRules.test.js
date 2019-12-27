import React from 'react';
import {
  render,
  waitForDomChange,
  queryAllByRole,
  queryByText,
} from '@testing-library/react';
import ApiRules from '../ApiRules';
import { MockedProvider } from '@apollo/react-testing';
import { GET_API_RULES } from 'gql/queries';

const mockNamespace = 'nsp';
const mockNavigate = jest.fn();
const gqlApiRulesRequest = APIRules => ({
  request: {
    query: GET_API_RULES,
    variables: { namespace: mockNamespace },
  },
  result: {
    data: {
      APIRules,
    },
  },
});
const apiRule = id => ({
  name: 'tets-api-rule' + id,
});

jest.mock('@kyma-project/luigi-client', () => ({
  getContext: () => ({
    namespaceId: mockNamespace,
  }),
  linkManager: () => ({
    fromClosestContext: () => ({
      navigate: mockNavigate,
    }),
  }),
}));

describe('ApiRules', () => {
  afterEach(() => {
    mockNavigate.mockReset();
  });

  it('Renders empty list', async () => {
    const { container, queryByRole } = render(
      <MockedProvider addTypename={false} mocks={[gqlApiRulesRequest([])]}>
        <ApiRules />
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
      <MockedProvider addTypename={false} mocks={[gqlApiRulesRequest([])]}>
        <ApiRules />
      </MockedProvider>,
    );

    expect(queryByRole('table')).not.toBeInTheDocument();
    expect(queryByLabelText('Loading')).toBeInTheDocument();

    await waitForDomChange(container);
  });

  it('Shows error status', async () => {
    const { container, queryByRole, queryByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={[]}>
        <ApiRules />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    expect(queryByRole('table')).not.toBeInTheDocument();
    expect(queryByLabelText('Loading')).not.toBeInTheDocument();
    expect(queryByText(/^Error!/)).toBeInTheDocument();
  });

  it('Renders some elements', async () => {
    const apis = [apiRule(1), apiRule(2)];
    const { container, queryByRole } = render(
      <MockedProvider addTypename={false} mocks={[gqlApiRulesRequest(apis)]}>
        <ApiRules />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    const table = queryByRole('table');
    expect(table).toBeInTheDocument();
    expect(queryAllByRole(table, 'row')).toHaveLength(3);
    apis.forEach(api => {
      expect(queryByText(table, api.name)).toBeInTheDocument();
    });
  });

  it('Clicking on element navigates to its details', async () => {
    const apis = [apiRule(1), apiRule(2)];
    const { container, getByText } = render(
      <MockedProvider addTypename={false} mocks={[gqlApiRulesRequest(apis)]}>
        <ApiRules />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    getByText(apis[1].name).click();
    expect(mockNavigate).toHaveBeenCalledWith(`/details/${apis[1].name}`);
  });

  it('Clicking on "Create" navigate to creation page', async () => {
    const apis = [apiRule(1), apiRule(2)];
    const { container, getByText } = render(
      <MockedProvider addTypename={false} mocks={[gqlApiRulesRequest(apis)]}>
        <ApiRules />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    getByText('Add new API rule').click();

    expect(mockNavigate).toHaveBeenCalledWith('/create');
  });

  test.todo('Clicking on "Edit" navigate to edit page');
  test.todo('Clicking on "Delete" deletes element');
});
