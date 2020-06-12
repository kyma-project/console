import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import EditNamespaceLabelsModal from '../EditNamespaceLabelsModal';

import { updateNamespaceMock, getNamespaceMock, namespaceMock } from './mocks';
import { MockedProvider } from '@apollo/react-testing';

describe('EditNamespaceLabelsModal', () => {
  it('displays existing labels', async () => {
    const { queryByText, getByLabelText } = render(
      <EditNamespaceLabelsModal namespace={{ labels: { a: 'b' } }} />,
    );

    // open modal
    fireEvent.click(getByLabelText('Edit labels'));

    expect(queryByText('a=b')).toBeInTheDocument();
  });

  it('allows label editing and sends out a request on submit', async () => {
    const {
      getByLabelText,
      getByPlaceholderText,
      getByText,
      queryByText,
    } = render(
      <MockedProvider
        mocks={[updateNamespaceMock, getNamespaceMock]}
        addTypename={false}
      >
        <>
          {/* fragment is required here */}
          <EditNamespaceLabelsModal namespace={namespaceMock} />,
        </>
      </MockedProvider>,
    );

    // open modal
    fireEvent.click(getByLabelText('Edit labels'));

    // remove label
    fireEvent.click(getByText('a=b'));

    // add label
    const input = getByPlaceholderText('Enter label key=value');
    fireEvent.change(input, { target: { value: 'e=f' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(queryByText('e=f')).toBeInTheDocument();

    expect(getByText('Save')).not.toBeDisabled();

    fireEvent.click(getByText('Save'));

    await wait(() => expect(updateNamespaceMock.result).toHaveBeenCalled());
  }, 20000); // large timeout for fd-modal and MockedProvider
});
