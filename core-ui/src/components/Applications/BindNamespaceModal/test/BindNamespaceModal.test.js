import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, waitForDomChange } from '@testing-library/react';

import { createMockLink } from 'react-shared';
import BindNamespaceModal from '../BindNamespaceModal';
import {
  exampleAppName,
  exampleBoundNamespaces,
  mockNamespaces,
} from './mocks';

jest.mock('@kyma-project/luigi-client', () => ({
  getContext: () => ({
    showSystemNamespaces: false,
  }),
}));

describe('BindNamespaceModal', () => {
  const openModal = async getByRoleFn => {
    const modalOpeningButton = getByRoleFn('button'); //get the only button around
    expect(modalOpeningButton.textContent).toBe('Create Binding'); // make sure this is the right one
    modalOpeningButton.click();
  };
  it('Modal opens after buttons click', async () => {
    const { link } = createMockLink([mockNamespaces]);
    const { queryByLabelText, getByRole, container } = render(
      <MockedProvider addTypename={false} link={link}>
        <BindNamespaceModal
          appName={exampleAppName}
          boundNamespaces={exampleBoundNamespaces}
        />
      </MockedProvider>,
    );

    expect(
      queryByLabelText('Create Namespace binding for Application'),
    ).not.toBeInTheDocument();
    await openModal(getByRole);
    await waitForDomChange(container);

    expect(
      queryByLabelText('Create Namespace binding for Application'),
    ).toBeInTheDocument();
  });
});

//todo: add more tests
