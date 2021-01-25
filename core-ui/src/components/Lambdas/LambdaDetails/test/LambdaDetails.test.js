import React from 'react';
import { render, wait } from '@testing-library/react';

import { EVENT_TRIGGER_EVENT_SUBSCRIPTION_MOCK } from 'components/Lambdas/gql/hooks/queries/testMocks';
import {
  withApolloMockProvider,
  lambdaMock,
} from 'components/Lambdas/helpers/testing';

import { BACKEND_MODULES } from 'components/Lambdas/helpers/misc';
import { LAMBDA_DETAILS } from 'components/Lambdas/constants';

import LambdaDetails from '../LambdaDetails';
import { MockedProvider } from '@apollo/react-testing';

// remove it after add 'mutationobserver-shim' to jest config https://github.com/jsdom/jsdom/issues/639
const mutationObserverMock = jest.fn(function MutationObserver(callback) {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
  // Optionally add a trigger() method to manually trigger a change
  this.trigger = mockedMutationsList => {
    callback(mockedMutationsList, this);
  };
});
global.MutationObserver = mutationObserverMock;

jest.mock('@luigi-project/client', () => {
  return {
    linkManager: () => ({
      navigate: () => {},
      withParams: () => ({
        openAsSplitView: () => ({
          expand: () => {},
          close: () => {},
        }),
        pathExists: () => Promise.resolve(true),
      }),
    }),
    addContextUpdateListener: () => {},
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
    getEventData: () => ({
      backendModules: ['apigateway'],
    }),
  };
});

jest.mock('react-shared', () => ({
  ...jest.requireActual('react-shared'),
  useConfig: () => ({ fromConfig: () => false }),
}));

describe('LambdaDetails', () => {
  it('should render header and tabs', async () => {
    const { getByText } = render(
      <MockedProvider>
        <LambdaDetails lambda={lambdaMock} />
      </MockedProvider>,
    );

    expect(getByText(LAMBDA_DETAILS.LABELS.TITLE)).toBeInTheDocument(); // labels column in header
    expect(getByText(LAMBDA_DETAILS.STATUS.TITLE)).toBeInTheDocument(); // status column in header
    expect(getByText(lambdaMock.name)).toBeInTheDocument(); // lambda name in breadcrumbs
    expect(getByText(LAMBDA_DETAILS.TABS.CODE.TITLE)).toBeInTheDocument(); // Code tab under header
    expect(
      getByText(LAMBDA_DETAILS.TABS.RESOURCE_MANAGEMENT.TITLE),
    ).toBeInTheDocument(); // Configuration tab under header
    await wait(() => {});
  });

  it('should not render Configuration tab', async () => {
    const { queryByText } = render(
      <MockedProvider>
        <LambdaDetails lambda={lambdaMock} />
      </MockedProvider>,
    );

    expect(
      queryByText(LAMBDA_DETAILS.TABS.CONFIGURATION.TITLE),
    ).not.toBeInTheDocument();
    await wait(() => {});
  });

  it('should render Configuration tab', async () => {
    const eventTriggersVariables = {
      serviceName: lambdaMock.name,
      namespace: lambdaMock.namespace,
    };
    const subscriptionMock = EVENT_TRIGGER_EVENT_SUBSCRIPTION_MOCK(
      eventTriggersVariables,
    );
    const { queryByText } = render(
      withApolloMockProvider({
        component: (
          <LambdaDetails
            lambda={lambdaMock}
            backendModules={[
              BACKEND_MODULES.APPLICATION,
              BACKEND_MODULES.EVENTING,
            ]}
          />
        ),
        mocks: [subscriptionMock],
      }),
    );

    expect(
      queryByText(LAMBDA_DETAILS.TABS.CONFIGURATION.TITLE),
    ).toBeInTheDocument();
    await wait(() => {});
  });
});
