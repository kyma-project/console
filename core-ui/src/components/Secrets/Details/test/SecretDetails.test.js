import React from 'react';
import { render } from '@testing-library/react';
import SecretDetails from '../SecretDetails';

import { name, namespace, secretQueryMock } from './mocks';
import { MockedProvider } from '@apollo/react-testing';

describe('SecretDetails', () => {
  it('renders with default props', async () => {
    const { findByText, findByLabelText, debug } = render(
      <MockedProvider addTypename={false} mocks={[secretQueryMock]}>
        <SecretDetails name={name} namespace={namespace} />
      </MockedProvider>,
    );

    await wait(() => {
      // Secret Header
      expect(findByLabelText('title')).toHaveTextContent(name);
      // Secret Data
      expect(findByText('Data')).toBeInTheDocument();
    });
  });
});
