import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NamespaceDetailsHeader from '../NamespaceDetailsHeader';
import { deleteNamespaceMock, namespace } from './mocks';
import { MockedProvider } from '@apollo/react-testing';
import { lambdaMock } from 'components/Lambdas/helpers/testing';
import { LAMBDA_EVENT_SUBSCRIPTION_MOCK } from 'components/Lambdas/gql/hooks/queries/testMocks';

const mockNavigate = jest.fn();
jest.mock('@luigi-project/client', () => ({
  uxManager: () => ({ showConfirmationModal: jest.fn() }),
  linkManager: () => ({ navigate: mockNavigate }),
}));

const mockFromConfig = jest.fn(() => 'testDomain');
jest.mock('react-shared', () => ({
  ...jest.requireActual('react-shared'),
  useConfig: () => ({
    fromConfig: mockFromConfig,
  }),
}));

const variables = {
  namespace: lambdaMock.namespace,
};
const subscriptionMock = LAMBDA_EVENT_SUBSCRIPTION_MOCK(variables);

describe('NamespaceDetailsHeader', () => {
  it('Renders with minimal props', async () => {
    const { queryByText, getByText } = render(
      <MockedProvider
        mocks={[deleteNamespaceMock, subscriptionMock]}
        addTypename={false}
      >
        <>
          <NamespaceDetailsHeader namespace={namespace} />,
        </>
      </MockedProvider>,
    );

    expect(queryByText('namespace')).toBeInTheDocument();
    expect(queryByText('a=b')).toBeInTheDocument();
    expect(queryByText('c=d')).toBeInTheDocument();

    fireEvent.click(getByText('Delete'));

    await wait(() => {
      expect(deleteNamespaceMock.result).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
