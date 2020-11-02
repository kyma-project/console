import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SecretList from '../SecretList';
import { MockedProvider } from '@apollo/react-testing';

import { GET_SECRETS_LIST } from 'gql/queries';
import { SECRET_EVENT_SUBSCRIPTION_LIST } from 'gql/subscriptions';

const namespace = 'test-namespace';

const currentDate = Date.now();
const msInMinute = 60000;
const creationDate = currentDate - msInMinute;
const creationDateFormat = creationDate / 1000;

export const secretsSubscriptionMock = (
  variables,
  secretEvent = {
    type: 'ADD',
    secret: {
      name: 'secret-1',
      data: {},
      json: {},
      creationTime: creationDateFormat,
      annotations: {
        annotation1: 'avalue1',
        annotation2: 'avalue2',
      },
      labels: {
        label1: 'avalue1',
        label2: 'avalue2',
      },
      type: 'Opaque',
    },
  },
) => ({
  request: {
    query: SECRET_EVENT_SUBSCRIPTION_LIST,
    variables,
  },
  result: {
    data: {
      secretEvent,
    },
  },
});
const secretsQueryMock = {
  request: {
    query: GET_SECRETS_LIST,
    variables: { namespace },
  },
  result: {
    data: {
      secrets: [
        {
          name: 'secret-1',
          data: {},
          json: {},
          creationTime: creationDateFormat,
          annotations: {
            annotation1: 'avalue1',
            annotation2: 'avalue2',
          },
          labels: {
            label1: 'avalue1',
            label2: 'avalue2',
          },
          type: 'Opaque',
        },
      ],
    },
  },
};

const subscriptionMock = secretsSubscriptionMock({
  namespace: namespace,
});
const mockNavigate = jest.fn();
jest.mock('@luigi-project/client', () => ({
  linkManager: () => ({ navigate: mockNavigate }),
}));

describe('SecretList', () => {
  it('Renders secrets', async () => {
    const { findByText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[secretsQueryMock, subscriptionMock]}
      >
        <SecretList namespace={namespace} />
      </MockedProvider>,
    );

    expect(await findByText('secret-1')).toBeInTheDocument();
  });

  it('Renders secret age properly', async () => {
    const { findAllByText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[subscriptionMock, secretsQueryMock]}
      >
        <SecretList namespace={namespace} />
      </MockedProvider>,
    );
    expect(await findAllByText('a minute ago'));
  });
});

it('Luigi navigate on secret click', async () => {
  const { findByText } = render(
    <MockedProvider
      addTypename={false}
      mocks={[subscriptionMock, secretsQueryMock]}
    >
      <SecretList namespace={namespace} />
    </MockedProvider>,
  );

  fireEvent.click(await findByText('secret-1'));

  expect(mockNavigate).toHaveBeenCalledWith('details/secret-1');
});
