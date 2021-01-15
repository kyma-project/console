import React from 'react';
import { render, fireEvent, waitForDomChange } from '@testing-library/react';
import CreateClusterRoleBindingModal from '../CreateClusterRoleBindingModal';
import { MockedProvider } from '@apollo/react-testing';

import * as mocks from './mocks';
const refetchClusterRoleBindingsFn = jest.fn();
jest.mock('react-shared', () => ({
  ...jest.requireActual('react-shared'),
  useConfig: () => ({ fromConfig: () => '' }),
  useMicrofrontendContext: () => ({}),
}));

describe('CreateClusterRoleBindingModal', () => {
  it('Creates binding', async () => {
    const { getByText, getByPlaceholderText } = render(
      <MockedProvider addTypename={false} mocks={Object.values(mocks)}>
        <CreateClusterRoleBindingModal
          refetchClusterRoleBindingsFn={refetchClusterRoleBindingsFn}
        />
      </MockedProvider>,
    );
    // open modal
    fireEvent.click(getByText('Create Binding'));
    await waitForDomChange();
    const submitButton = getByText('Save');
    expect(submitButton).toBeDisabled();
    // fill form
    fireEvent.change(getByPlaceholderText('User name'), {
      target: { value: 'user' },
    });
    expect(submitButton).toBeDisabled();
    fireEvent.click(getByPlaceholderText('Choose role...'));
    fireEvent.click(getByText('cluster-role-1'));
    // submit form
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    await wait(() => expect(mutationMock.result).toHaveBeenCalled());
  }, 10000); // standard timeout for Modal + MockedProvider
});
