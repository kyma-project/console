import React from 'react';
import { GET_API_RULE } from 'gql/queries';
import { render, waitForDomChange, queryByText } from '@testing-library/react';
import ApiRuleDetails from '../ApiRuleDetails';
import { MockedProvider } from '@apollo/react-testing';
import { DELETE_API_RULE } from 'gql/mutations';

const mockNavigate = jest.fn();
const mockShowConfirmationModal = jest.fn(() => Promise.resolve());

const apiRule = {
  name: 'tets',
  service: {
    name: 'tets-service',
    host: 'tets.kyma.cluster.com',
    port: 8080,
  },
  rules: [
    {
      path: '/aaa',
      methods: ['GET'],
      accessStrategies: [
        {
          name: 'allow',
        },
      ],
    },
    {
      path: '/bbb',
      methods: ['POST'],
      accessStrategies: [
        {
          name: 'allow',
        },
      ],
    },
  ],
};
const mockNamespace = 'nsp';
const validResponseMock = {
  request: {
    query: GET_API_RULE,
    variables: { name: apiRule.name, namespace: mockNamespace },
  },
  result: {
    data: {
      APIRule: apiRule,
    },
  },
};

const gqlDeleteRequest = {
  request: {
    query: DELETE_API_RULE,
    variables: { namespace: mockNamespace, name: apiRule.name },
  },
  result: jest.fn(() => ({
    data: {
      deleteAPIRule: {
        name: apiRule.name,
      },
    },
  })),
};

jest.mock('@kyma-project/luigi-client', () => ({
  getContext: () => ({
    namespaceId: mockNamespace,
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

describe('ApiRuleDetails', () => {
  it('renders rule name', async () => {
    const { queryByText, container } = render(
      <MockedProvider addTypename={false} mocks={[validResponseMock]}>
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    expect(queryByText(apiRule.name)).toBeInTheDocument();
  });

  it('renders rule host', async () => {
    const { queryByText, container } = render(
      <MockedProvider addTypename={false} mocks={[validResponseMock]}>
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    expect(queryByText(new RegExp(apiRule.service.host))).toBeInTheDocument();
  });

  it('renders rule service', async () => {
    const { queryByText, container } = render(
      <MockedProvider addTypename={false} mocks={[validResponseMock]}>
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    const serviceNameField = queryByText(new RegExp(apiRule.service.name));
    expect(serviceNameField).toBeInTheDocument();
    expect(serviceNameField).toHaveTextContent(
      new RegExp(apiRule.service.port),
    );
  });

  it('renders access strategies', async () => {
    const { getByLabelText, container } = render(
      <MockedProvider addTypename={false} mocks={[validResponseMock]}>
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );
    await waitForDomChange(container);

    const accessStrategiesSection = getByLabelText('Access strategies');
    apiRule.rules.forEach(rule => {
      expect(
        queryByText(accessStrategiesSection, rule.path),
      ).toBeInTheDocument();
    });
  });

  it('renders loading state', async () => {
    const { queryByLabelText, container } = render(
      <MockedProvider addTypename={false} mocks={[validResponseMock]}>
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );

    expect(queryByLabelText('Loading')).toBeInTheDocument();

    await waitForDomChange(container);
  });

  it('renders error', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} mocks={[]}>
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    expect(container).toMatchSnapshot();
  });

  it('renders breadcrumb', async () => {
    const { queryAllByLabelText, container } = render(
      <MockedProvider addTypename={false} mocks={[validResponseMock]}>
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    expect(queryAllByLabelText('breadcrumb-item')).toMatchSnapshot();
  });

  it('Clicking on "Delete" deletes element', async () => {
    const { container, getByText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[validResponseMock, gqlDeleteRequest]}
      >
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    getByText('Delete').click();

    await waitForDomChange(container);

    expect(mockShowConfirmationModal).toHaveBeenCalled();
    expect(gqlDeleteRequest.result).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('');
  });
});
