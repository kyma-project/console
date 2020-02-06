import React from 'react';
import { render, wait } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import { createMockLink } from 'react-shared';
import ApplicationDetails from '../ApplicationDetails';
import {
  exampleAppId,
  mockCompassApp,
  mockKymaAppNull,
  exampleAppName,
  mockCompassAppNull,
  mockKymaApp,
  exampleKymaApp,
} from './mocks';

jest.mock('@kyma-project/luigi-client', () => ({
  getContext: () => ({
    showSystemNamespaces: true,
  }),
  uxManager: () => ({
    addBackdrop: jest.fn(),
    removeBackdrop: jest.fn(),
  }),
}));

jest.mock('index', () => {
  return {
    CompassGqlContext: {},
  };
});

describe('ApplicationDetails', () => {
  it("Renders only header when app doesn't exist in kyma", async () => {
    const { link } = createMockLink([mockCompassApp, mockKymaAppNull]);
    const { queryByText, queryByTestId } = render(
      <MockedProvider link={link} addTypename={false}>
        <ApplicationDetails appId={exampleAppId} />
      </MockedProvider>,
    );

    await wait(() => {
      const appName = queryByText(exampleAppName);
      const appStatus = queryByText('NOT_INSTALLED');

      const namespaceBindingsList = queryByTestId('namespace-bindings-list');
      expect(appName).toBeInTheDocument();
      expect(appStatus).toBeInTheDocument();
      expect(namespaceBindingsList).not.toBeInTheDocument();
    });
  });

  it("Renders empty header when app doesn't exist in compass", async () => {
    const { link } = createMockLink([mockCompassAppNull, mockKymaAppNull]);
    const { queryByText, queryByTestId } = render(
      <MockedProvider link={link} addTypename={false}>
        <ApplicationDetails appId={exampleAppId} />
      </MockedProvider>,
    );

    await wait(() => {
      const statusHeader = queryByText('Status');
      const descriptionHeader = queryByText('Description');
      const namespaceBindingsList = queryByTestId('namespace-bindings-list');
      expect(statusHeader).not.toBeInTheDocument();
      expect(descriptionHeader).not.toBeInTheDocument();
      expect(namespaceBindingsList).not.toBeInTheDocument();
    });
  });

  it('Renders header and list when app exists in kyma and compass', async () => {
    const { link } = createMockLink([mockCompassApp, mockKymaApp]);
    const { queryByText, queryByTestId } = render(
      <MockedProvider link={link} addTypename={false}>
        <ApplicationDetails appId={exampleAppId} />
      </MockedProvider>,
    );

    await wait(() => {
      const appName = queryByText(exampleAppName);
      const appStatus = queryByText(exampleKymaApp.status);
      const namespaceBindingsList = queryByTestId('namespace-bindings-list');
      expect(appName).toBeInTheDocument();
      expect(appStatus).toBeInTheDocument();
      expect(namespaceBindingsList).toBeInTheDocument();
    });
  });
});
