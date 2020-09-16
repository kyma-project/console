import React from 'react';
import { render, fireEvent, waitForDomChange } from '@testing-library/react';
import CreateRoleBindingModal from '../CreateRoleBindingModal';
import { MockedProvider } from '@apollo/react-testing';

import * as mockData from './mocks';

describe('CreateRoleBindingModal', () => {
  const { namespace, ...mocks } = mockData;

  it.todo('Creates binding');

  // it('Creates binding', async () => {
  //   const { getByText, getByPlaceholderText } = render(
  //     <MockedProvider addTypename={false} mocks={Object.values(mocks)}>
  //       <CreateRoleBindingModal namespaceId={namespace} />
  //     </MockedProvider>,
  //   );

  //   // open modal
  //   fireEvent.click(getByText('Create Binding'));
  //   await waitForDomChange();

  //   const submitButton = getByText('Save');
  //   expect(submitButton).toBeDisabled();

  //   // fill form
  //   fireEvent.change(getByPlaceholderText('User name'), {
  //     target: { value: 'user' },
  //   });
  //   expect(submitButton).toBeDisabled();

  //   fireEvent.click(getByPlaceholderText('Choose role...'));
  //   fireEvent.click(getByText('role-1'));

  //   // submit form
  //   expect(submitButton).not.toBeDisabled();
  //   fireEvent.click(submitButton);

  //   await wait(() => expect(mutationMock.result).toHaveBeenCalled());
  // });
});
