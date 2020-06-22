import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  render,
  waitForDomChange,
  fireEvent,
  wait,
} from '@testing-library/react';

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

function openModal(selectorFn) {
  const modalOpeningComponent = selectorFn('Create Binding');
  modalOpeningComponent.click();
}

describe('BindNamespaceModal', () => {
  it('opens after buttons click', async () => {
    const { link } = createMockLink([mockNamespacesError]);
    const { queryByText, getByText } = render(
      <MockedProvider link={link}>
        <BindNamespaceModal appName={exampleAppName} boundNamespaces={[]} />
      </MockedProvider>,
    );

    // modal header should not be shown before modal is opened
    expect(
      queryByText('Create Namespace binding for Application'),
    ).not.toBeInTheDocument();

    openModal(getByText);

    await wait(() => {
      expect(
        queryByText('Create Namespace binding for Application'),
      ).toBeInTheDocument();
    });
  });

  it('shows a list of namespaces to bind', async () => {
    const { link } = createMockLink([mockNamespaces]);
    const { queryByText, getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BindNamespaceModal
          appName={exampleAppName}
          boundNamespaces={exampleBoundNamespaces}
        />
      </MockedProvider>,
    );

    openModal(getByText);
    await waitForDomChange();

    // namespace already bound to an app should not be shown
    expect(queryByText(exampleNamespaces[0].name)).not.toBeInTheDocument();

    // namespace not bound to an app should be shown
    expect(queryByText(exampleNamespaces[1].name)).toBeInTheDocument();
  });

  it('shows an error on failure', async () => {
    const { link } = createMockLink([mockNamespacesError]);

    const { queryByText, getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BindNamespaceModal
          appName={exampleAppName}
          boundNamespaces={exampleBoundNamespaces}
        />
      </MockedProvider>,
    );

    openModal(getByText);

    await wait(() => {
      const errorMessage = `Could not fetch namespaces`;
      expect(queryByText(new RegExp(errorMessage))).toBeInTheDocument();
    });
  });

  it("shows the 'no namespaces available' message if all namespaces are already bound to an app", async () => {
    const { link } = createMockLink([mockNamespaces]);

    const boundNamespaces = [
      exampleNamespaces[0].name,
      exampleNamespaces[1].name,
    ];
    const { queryByText, getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BindNamespaceModal
          appName={exampleAppName}
          boundNamespaces={boundNamespaces}
        />
      </MockedProvider>,
    );

    openModal(getByText);

    await wait(() => {
      expect(
        queryByText('No Namespaces avaliable to bind'),
      ).toBeInTheDocument();
    });
  });
});
