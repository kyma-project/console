import React from 'react';
import { render, waitForDomChange, fireEvent } from '@testing-library/react';
import Runtimes from '../Runtimes';
import { MockedProvider } from '@apollo/react-testing';
import { GET_RUNTIMES } from '../gql';

jest.mock('react-shared', () => ({
  ...jest.requireActual('react-shared'),
  useConfig: () => ({ fromConfig: () => 'test-value' }),
  useMicrofrontendContext: () => ({}),
}));

describe('Runtimes', () => {
  it('Renders initial runtimes', async () => {
    const test = render(
      <MockedProvider mocks={[MOCK_GET_RUNTIMES]} addTypename={false}>
        <Runtimes />
      </MockedProvider>,
    );

    await waitForDomChange();

    MOCK_GET_RUNTIMES.result.data.runtimes.data.forEach(runtime => {
      expectRuntime(test, runtime);
    });

    expect(
      test.queryByText('No more runtimes to show'),
    ).not.toBeInTheDocument();
    expectNumberOfRows(test, [MOCK_GET_RUNTIMES]);
  });

  it('Renders additional runtiems when scrolled to bottom', async () => {
    const test = render(
      <MockedProvider
        mocks={[MOCK_GET_RUNTIMES, MOCK_GET_ADDITIONAL_RUNTIMES]}
        addTypename={false}
      >
        <Runtimes />
      </MockedProvider>,
    );

    await waitForDomChange();

    fireScrollEvent(true);

    await waitForDomChange();

    MOCK_GET_RUNTIMES.result.data.runtimes.data.forEach(runtime => {
      expectRuntime(test, runtime);
    });
    MOCK_GET_ADDITIONAL_RUNTIMES.result.data.runtimes.data.forEach(runtime => {
      expectRuntime(test, runtime);
    });

    expectNumberOfRows(test, [MOCK_GET_RUNTIMES, MOCK_GET_ADDITIONAL_RUNTIMES]);
    expect(test.queryByText('No more runtimes to show')).toBeInTheDocument();
  });

  it('Do nothing when scrolled not to bottom', async () => {
    const test = render(
      <MockedProvider
        mocks={[MOCK_GET_RUNTIMES, MOCK_GET_ADDITIONAL_RUNTIMES]}
        addTypename={false}
      >
        <Runtimes />
      </MockedProvider>,
    );

    await waitForDomChange();

    fireScrollEvent(false);

    MOCK_GET_RUNTIMES.result.data.runtimes.data.forEach(runtime => {
      expectRuntime(test, runtime);
    });
    expectNumberOfRows(test, [MOCK_GET_RUNTIMES]);
  });

  it('Stop loading additional runtimes when there are no more runtimes', async () => {
    const test = render(
      <MockedProvider
        mocks={[MOCK_GET_RUNTIMES, MOCK_GET_ADDITIONAL_RUNTIMES]}
        addTypename={false}
      >
        <Runtimes />
      </MockedProvider>,
    );

    await waitForDomChange();

    fireScrollEvent(true);

    await waitForDomChange();

    fireScrollEvent(true);

    expectNumberOfRows(test, [MOCK_GET_RUNTIMES, MOCK_GET_ADDITIONAL_RUNTIMES]);
    expect(test.queryByText('No more runtimes to show')).toBeInTheDocument();
  });
});

function expectRuntime({ queryByText }, runtime) {
  expect(queryByText(runtime.name)).toBeInTheDocument();
  expect(queryByText(runtime.description)).toBeInTheDocument();
  runtime.labels.scenarios.forEach(s => {
    expect(queryByText(s)).toBeInTheDocument();
  });
  expect(queryByText(runtime.status.condition)).toBeInTheDocument();
}

function expectNumberOfRows({ queryAllByRole }, mocks) {
  const loadedRows = mocks.reduce(
    (acc, mock) => acc + mock.result.data.runtimes.data.length,
    1, // include header row
  );
  expect(queryAllByRole('row')).toHaveLength(loadedRows);
}

function fireScrollEvent(isBottom) {
  fireEvent.scroll(window.document, {
    target: {
      scrollingElement: {
        scrollHeight: isBottom ? 800 : 900,
        scrollTop: 200,
        clientHeight: 600,
      },
    },
  });
}

function generateRuntimes(fromId, toId) {
  return [...Array(toId - fromId + 1).keys()].map(id => ({
    name: `runtime-${id + fromId}`,
    id: `${id + fromId}`,
    description: `blablabla-${id + fromId}`,
    labels: { scenarios: [`my-scenario-${id + fromId}`] },
    status: {
      condition: `status-${id + fromId}`,
    },
  }));
}

const mockCursor = 'cursor';

const MOCK_GET_RUNTIMES = {
  request: {
    query: GET_RUNTIMES,
    variables: {
      after: null,
    },
  },

  result: {
    data: {
      runtimes: {
        data: generateRuntimes(1, 10),
        totalCount: 20,
        pageInfo: {
          endCursor: mockCursor,
          hasNextPage: true,
        },
      },
    },
  },
};

const MOCK_GET_ADDITIONAL_RUNTIMES = {
  request: {
    query: GET_RUNTIMES,
    variables: {
      after: mockCursor,
    },
  },

  result: {
    data: {
      runtimes: {
        data: generateRuntimes(11, 20),
        totalCount: 20,
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
        },
      },
    },
  },
};
