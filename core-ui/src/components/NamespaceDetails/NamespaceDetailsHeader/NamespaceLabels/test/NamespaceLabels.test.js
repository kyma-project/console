import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import NamespaceLabels from '../NamespaceLabels';

import { updateNamespaceMock, getNamespaceMock, namespaceMock } from './mocks';
import { MockedProvider } from '@apollo/react-testing';

describe('NamespaceLabels', () => {
  it('displays existing labels', async () => {
    const { queryByText } = render(
      <NamespaceLabels namespace={{ labels: { a: 'b' } }} />,
    );
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
        <NamespaceLabels namespace={namespaceMock} />
      </MockedProvider>,
    );

    fireEvent.click(getByLabelText('Edit labels'));

    // remove label
    fireEvent.click(getByText('a=b'));

    // add label
    const input = getByPlaceholderText('Enter label key=value');
    fireEvent.change(input, { target: { value: 'e=f' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(queryByText('e=f')).toBeInTheDocument();

    fireEvent.click(getByLabelText('Apply'));

    await wait(() => expect(updateNamespaceMock.result).toHaveBeenCalled());
  }, 20000); // large timeout for fd-modal and MockedProvider
});
