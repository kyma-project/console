import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NamespaceDetailsHeader from '../NamespaceDetailsHeader';
import { deleteNamespaceMock, namespace } from './mocks';
import { MockedProvider } from '@apollo/react-testing';

const mockNavigate = jest.fn();
jest.mock('@luigi-project/client', () => ({
  uxManager: () => ({ showConfirmationModal: jest.fn() }),
  linkManager: () => ({ navigate: mockNavigate }),
}));

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.cluster.com',
}));

describe('NamespaceDetailsHeader', () => {
  it('Renders with minimal props', async () => {
    const { queryByText, getByText } = render(
      <MockedProvider mocks={[deleteNamespaceMock]} addTypename={false}>
        <>
          <NamespaceDetailsHeader namespace={namespace} />,
        </>
      </MockedProvider>,
    );

    expect(queryByText('ns')).toBeInTheDocument();
    expect(queryByText('a=b')).toBeInTheDocument();
    expect(queryByText('c=d')).toBeInTheDocument();

    fireEvent.click(getByText('Delete'));

    await wait(() => {
      expect(deleteNamespaceMock.result).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
