import React from 'react';
import { render, wait } from '@testing-library/react';

import { lambdaMock } from 'components/Lambdas/helpers/testing';

import { LAMBDA_DETAILS } from 'components/Lambdas/constants';

import LambdaDetails from '../LambdaDetails';

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
      }),
    }),
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
    getEventData: () => ({
      backendModules: [],
    }),
  };
});

describe('LambdaDetails', () => {
  it('should render header and tabs', async () => {
    const { getByText } = render(<LambdaDetails lambda={lambdaMock} />);

    expect(getByText(LAMBDA_DETAILS.LABELS.TITLE)).toBeInTheDocument(); // labels column in header
    expect(getByText(LAMBDA_DETAILS.STATUS.TITLE)).toBeInTheDocument(); // status column in header
    expect(getByText(lambdaMock.name)).toBeInTheDocument(); // lambda name in breadcrumbs
    expect(getByText(LAMBDA_DETAILS.TABS.CODE.TITLE)).toBeInTheDocument(); // Code tab under header
    expect(
      getByText(LAMBDA_DETAILS.TABS.CONFIGURATION.TITLE),
    ).toBeInTheDocument(); // Configuration tab under header
    await wait();
  });
});
