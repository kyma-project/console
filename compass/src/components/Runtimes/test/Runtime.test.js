import React from 'react';
import {
  render,
  wait,
  waitForDomChange,
  fireEvent,
} from '@testing-library/react';
import Runtimes from '../Runtimes';
import { MockedProvider } from '@apollo/react-testing';
import { GET_RUNTIMES } from '../gql';

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

    fireEvent.scroll(window.document, {
      target: {
        scrollingElement: {
          scrollHeight: 800,
          scrollTop: 200,
          clientHeight: 600,
        },
      },
    });

    await waitForDomChange();

    MOCK_GET_RUNTIMES.result.data.runtimes.data.forEach(runtime => {
      expectRuntime(test, runtime);
    });
    MOCK_GET_ADDITIONAL_RUNTIMES.result.data.runtimes.data.forEach(runtime => {
      expectRuntime(test, runtime);
    });
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

    fireEvent.scroll(window.document, {
      target: {
        scrollingElement: {
          scrollHeight: 900,
          scrollTop: 200,
          clientHeight: 600,
        },
      },
    });

    await waitForDomChange();

    MOCK_GET_RUNTIMES.result.data.runtimes.data.forEach(runtime => {
      expectRuntime(test, runtime);
    });
    MOCK_GET_ADDITIONAL_RUNTIMES.result.data.runtimes.data.forEach(runtime => {
      expectNoRuntime(test, runtime);
    });
  });

  test.todo('Stop loading additional runtimes when there are no more runtimes');
});

function expectRuntime({ queryByText }, runtime) {
  expect(queryByText(runtime.name)).toBeInTheDocument();
}

function expectNoRuntime({ queryByText }, runtime) {
  expect(queryByText(runtime.name)).not.toBeInTheDocument();
}

function generateRuntimes(fromId, toId) {
  return [...Array(toId - fromId + 1).keys()].map(id => ({
    name: `runtime-${id + fromId}`,
    id: `${id + fromId}`,
    description: `blablabla-${id + fromId}`,
    labels: {},
    status: {
      condition: 'INITIAL',
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
