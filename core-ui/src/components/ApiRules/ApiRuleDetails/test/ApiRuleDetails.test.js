import React from 'react';
import { GET_API_RULE } from 'gql/queries';
import {
  render,
  waitForDomChange,
  queryByText,
  wait,
} from '@testing-library/react';
import ApiRuleDetails from '../ApiRuleDetails';
import { MockedProvider } from '@apollo/react-testing';
import { DELETE_API_RULE } from 'gql/mutations';

const mockNavigate = jest.fn();
const mockShowConfirmationModal = jest.fn(() => Promise.resolve());

const apiRule = {
  name: 'tets',
  spec: {
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
            name: 'noop',
          },
        ],
      },
      {
        path: '/bbb',
        methods: ['POST'],
        accessStrategies: [
          {
            name: 'noop',
          },
        ],
      },
    ],
  },
  status: {
    apiRuleStatus: {
      code: 'OK',
      desc: '',
    },
  },
};
const apiRuleWithShortHost = {
  name: 'tets2',
  spec: {
    service: {
      name: 'tets-service',
      host: 'tets',
      port: 8080,
    },
    rules: [],
  },
  status: {
    apiRuleStatus: {
      code: 'OK',
      desc: '',
    },
  },
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

const shortHostResponseMock = {
  request: {
    query: GET_API_RULE,
    variables: { name: apiRuleWithShortHost.name, namespace: mockNamespace },
  },
  result: {
    data: {
      APIRule: apiRuleWithShortHost,
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

jest.mock('@luigi-project/client', () => ({
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
  getNodeParams: () => ({}),
}));

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.cluster.com',
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

    expect(
      queryByText(new RegExp(apiRule.spec.service.host)),
    ).toBeInTheDocument();
  });

  it('renders rule status', async () => {
    const { queryByText, container } = render(
      <MockedProvider addTypename={false} mocks={[validResponseMock]}>
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    expect(
      queryByText(new RegExp(apiRule.status.apiRuleStatus.code)),
    ).toBeInTheDocument();
  });

  it('renders auto-completed host url', async () => {
    const { queryByText, container } = render(
      <MockedProvider addTypename={false} mocks={[shortHostResponseMock]}>
        <ApiRuleDetails apiName={apiRuleWithShortHost.name} />
      </MockedProvider>,
    );

    await waitForDomChange(container);
    expect(
      queryByText(
        new RegExp(
          `${apiRuleWithShortHost.spec.service.host}\\.kyma\\.cluster\\.com`,
        ),
      ),
    ).toBeInTheDocument();
  });

  it('renders rule service', async () => {
    const { queryByText, container } = render(
      <MockedProvider addTypename={false} mocks={[validResponseMock]}>
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );

    await waitForDomChange(container);

    const serviceNameField = queryByText(new RegExp(apiRule.spec.service.name));
    expect(serviceNameField).toBeInTheDocument();
    expect(serviceNameField).toHaveTextContent(
      new RegExp(apiRule.spec.service.port),
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
    apiRule.spec.rules.forEach(rule => {
      expect(
        queryByText(accessStrategiesSection, rule.path),
      ).toBeInTheDocument();
    });
  });

  it('renders loading state', async () => {
    const { queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={[validResponseMock]}>
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );

    expect(queryByLabelText('Loading')).toBeInTheDocument();
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

  it('renders delete and edit buttons', async () => {
    const { container, queryByText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[validResponseMock, gqlDeleteRequest]}
      >
        <ApiRuleDetails apiName={apiRule.name} />
      </MockedProvider>,
    );

    await waitForDomChange(container);
    expect(queryByText('Delete')).toBeInTheDocument();
    expect(queryByText('Edit')).toBeInTheDocument();
  });
});
