import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import NamespaceApplications from '../NamespaceApplications';

import { unbindNamespace, getNamespace, namespace } from './mocks';
import { MockedProvider } from '@apollo/react-testing';

describe('NamespaceApplications', () => {
  it('renders applications', () => {
    const { getByText } = render(
      <NamespaceApplications namespace={namespace} />,
    );
    namespace.applications.forEach(app =>
      expect(getByText(app)).toBeInTheDocument(),
    );
  });

  it('unbinds application', async () => {
    const { getAllByLabelText } = render(
      <MockedProvider
        mocks={[unbindNamespace, getNamespace]}
        addTypename={false}
      >
        <NamespaceApplications namespace={namespace} />
      </MockedProvider>,
    );

    fireEvent.click(getAllByLabelText('Unbind')[0]);

    await wait(() => expect(unbindNamespace.result).toHaveBeenCalled());
  });
});
