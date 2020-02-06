import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, waitForDomChange, fireEvent } from '@testing-library/react';

import { createMockLink } from 'react-shared';
import BindNamespaceModal from '../BindNamespaceModal';
import {
  exampleAppName,
  exampleNamespaces,
  exampleBoundNamespaces,
  mockNamespaces,
  mockNamespacesError,
} from './mocks';

jest.mock('@kyma-project/luigi-client', () => ({
  getContext: () => ({
    showSystemNamespaces: false,
  }),
}));

describe('BindNamespaceModal', () => {
  it('opens after buttons click', async () => {
    const { link } = createMockLink([mockNamespaces]);
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BindNamespaceModal
          appName={exampleAppName}
          boundNamespaces={exampleBoundNamespaces}
        />
      </MockedProvider>,
    );

    // modal header should not be shown before modal is opened
    expect(
      queryByText('Create Namespace binding for Application'),
    ).not.toBeInTheDocument();

    const modalOpeningComponent = queryByText('Create Binding');
    expect(modalOpeningComponent).toBeInTheDocument();
    fireEvent.click(modalOpeningComponent);
    await waitForDomChange();

    expect(
      queryByText('Create Namespace binding for Application'),
    ).toBeInTheDocument();
  }, 10000);

  it('shows a list of namespaces to bind', async () => {
    const { link } = createMockLink([mockNamespaces]);
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BindNamespaceModal
          appName={exampleAppName}
          boundNamespaces={exampleBoundNamespaces}
        />
      </MockedProvider>,
    );

    const modalOpeningComponent = queryByText('Create Binding');
    fireEvent.click(modalOpeningComponent);
    await waitForDomChange();

    // namespace already bound to an app should not be shown
    expect(queryByText(exampleNamespaces[0].name)).not.toBeInTheDocument();
    // namespace not bound to an app should be shown
    expect(queryByText(exampleNamespaces[1].name)).toBeInTheDocument();
  }, 10000);

  it('shows an error on failure', async () => {
    const { link } = createMockLink([mockNamespacesError]);

    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BindNamespaceModal
          appName={exampleAppName}
          boundNamespaces={exampleBoundNamespaces}
        />
      </MockedProvider>,
    );

    const modalOpeningComponent = queryByText('Create Binding');
    fireEvent.click(modalOpeningComponent);
    await waitForDomChange();

    const errorMessage = mockNamespacesError.error.message;
    expect(queryByText(new RegExp(errorMessage))).toBeInTheDocument();
  }, 10000);

  it("shows the 'no namespaces available' message if all namespaces are already bound to an app", async () => {
    const { link } = createMockLink([mockNamespaces]);

    const boundNamespaces = [
      exampleNamespaces[0].name,
      exampleNamespaces[1].name,
    ];
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BindNamespaceModal
          appName={exampleAppName}
          boundNamespaces={boundNamespaces}
        />
      </MockedProvider>,
    );

    const modalOpeningComponent = queryByText('Create Binding');
    fireEvent.click(modalOpeningComponent);
    await waitForDomChange();

    expect(queryByText('No Namespaces avaliable to bind')).toBeInTheDocument();
  }, 10000);
});
